const { expectRevert, time } = require('openzeppelin-test-helpers');

const BandMockExchange = artifacts.require('BandMockExchange');
const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const OffchainAggTCD = artifacts.require('OffchainAggTCD');
const OffchainAggTCDFactory = artifacts.require('OffchainAggTCDFactory');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');
const QueryTCDMock = artifacts.require('QueryTCDMock');

require('chai').should();

const sign = async (k, v, t, addr, signer) => {
  const hash = web3.utils.soliditySha3(
    { t: 'bytes', v: k },
    { t: 'uint256', v: v },
    { t: 'uint64', v: t },
    { t: 'uint8', v: 1 },
    { t: 'address', v: addr },
  );
  const sig = await web3.eth.sign(hash, signer);
  return {
    v: '0x' + sig.slice(66 + 64, 66 + 64 + 2) === '0x00' ? '0x1b' : '0x1c',
    r: '0x' + sig.slice(2, 66),
    s: '0x' + sig.slice(66, 66 + 64),
  };
};

contract('OffchainAggTCD', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.band = await BandToken.new({ from: owner });
    await this.band.mint(owner, 100000000, { from: owner });
    this.exchange = await BandMockExchange.new(this.band.address, {
      from: owner,
    });
    this.mtcdFactory = await OffchainAggTCDFactory.new();
    this.registry = await BandRegistry.new(
      this.band.address,
      this.exchange.address,
      { from: owner },
    );
    this.commFactory = await CommunityFactory.new(this.registry.address, {
      from: owner,
    });
    const testCurve = await BondingCurveExpression.new([1]);
    const data1 = await this.commFactory.create(
      'CoinHatcher',
      'CHT',
      testCurve.address,
      '0',
      '60',
      '5',
      '5',
      {
        from: owner,
      },
    );
    // console.log(data1.receipt.logs);
    this.comm = await CommunityToken.at(data1.receipt.logs[2].args.token);
    this.curve = await BondingCurve.at(data1.receipt.logs[2].args.bondingCurve);
    this.params = await Parameters.at(data1.receipt.logs[2].args.params);
    await this.comm.addCapper(this.mtcdFactory.address, { from: owner });
    const data2 = await this.mtcdFactory.createOffchainAggTCD(
      web3.utils.fromAscii('data:'),
      data1.receipt.logs[2].args.bondingCurve,
      this.registry.address,
      data1.receipt.logs[2].args.params,
    );
    await this.params.setRaw(
      [
        web3.utils.fromAscii('data:min_provider_stake'),
        web3.utils.fromAscii('data:max_provider_count'),
        web3.utils.fromAscii('data:owner_revenue_pct'),
        web3.utils.fromAscii('data:query_price'),
        web3.utils.fromAscii('data:withdraw_delay'),
      ],
      [10, 3, '500000000000000000', 100, 0],
      { from: owner },
    );

    this.mtcd = await OffchainAggTCD.at(data2.receipt.logs[0].args.mtcd);
    this.queryMock = await QueryTCDMock.new(this.mtcd.address);

    await this.band.transfer(alice, 10000000, { from: owner });
    await this.band.transfer(bob, 10000000, { from: owner });
    await this.band.transfer(carol, 10000000, { from: owner });
    // alice buy 1000 SDD
    const calldata1 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      this.curve.address,
      1000000,
      '0x' + calldata1.slice(2, 10),
      '0x' + calldata1.slice(138),
      { from: alice },
    );
    // bob buy 1000 SDD
    const calldata2 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      this.curve.address,
      3000000,
      '0x' + calldata2.slice(2, 10),
      '0x' + calldata2.slice(138),
      { from: bob },
    );
    // carol buy 1000 SDD
    const calldata3 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      this.curve.address,
      5000000,
      '0x' + calldata3.slice(2, 10),
      '0x' + calldata3.slice(138),
      { from: carol },
    );
    // owner buy 1000 SDD
    const calldata4 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      this.curve.address,
      7000000,
      '0x' + calldata4.slice(2, 10),
      '0x' + calldata4.slice(138),
      { from: owner },
    );

    await this.band.transfer(this.exchange.address, 10000000, { from: owner });
    await this.exchange.setExchangeRate('1000000000000000000000', {
      from: owner,
    });
  });
  context('Registration', () => {
    it('check setting of multisig tcd', async () => {
      (await this.mtcd.token()).toString().should.eq(this.comm.address);
      (await this.mtcd.params()).toString().should.eq(this.params.address);
      (await this.mtcd.activeCount()).toNumber().should.eq(0);
      (await this.mtcd.reserveCount()).toNumber().should.eq(0);
    });
    it('should revert if stake less than min_provider_stake', async () => {
      await this.mtcd.register(
        owner,
        '0x0000000000000000000000000000000000000001',
        40,
        { from: owner },
      );
      await this.mtcd.register(
        alice,
        '0x0000000000000000000000000000000000000001',
        30,
        { from: alice },
      );
      await this.mtcd.register(
        bob,
        '0x0000000000000000000000000000000000000001',
        20,
        { from: bob },
      );
      await expectRevert.unspecified(
        this.mtcd.register(
          carol,
          '0x0000000000000000000000000000000000000001',
          9,
          { from: carol },
        ),
      );
      await this.mtcd.register(
        carol,
        '0x0000000000000000000000000000000000000001',
        10,
        { from: carol },
      );

      (await this.mtcd.activeCount()).toNumber().should.eq(3);

      (await this.mtcd.reserveCount()).toNumber().should.eq(1);

      (await this.comm.unlockedBalanceOf(owner))
        .toNumber()
        .should.eq(1000 - 40);
      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10);

      const ownerDataSource = await this.mtcd.infoMap(owner);
      const aliceDataSource = await this.mtcd.infoMap(alice);
      const bobDataSource = await this.mtcd.infoMap(bob);
      const carolDataSource = await this.mtcd.infoMap(carol);

      ownerDataSource.stake.toNumber().should.eq(40);
      aliceDataSource.stake.toNumber().should.eq(30);
      bobDataSource.stake.toNumber().should.eq(20);
      carolDataSource.stake.toNumber().should.eq(10);

      ownerDataSource.totalOwnerships.toNumber().should.eq(40);
      aliceDataSource.totalOwnerships.toNumber().should.eq(30);
      bobDataSource.totalOwnerships.toNumber().should.eq(20);
      carolDataSource.totalOwnerships.toNumber().should.eq(10);

      ownerDataSource.owner.toString().should.eq(owner);
      aliceDataSource.owner.toString().should.eq(alice);
      bobDataSource.owner.toString().should.eq(bob);
      carolDataSource.owner.toString().should.eq(carol);
    });
    it('should revert if try to register again', async () => {
      await this.mtcd.register(
        carol,
        '0x0000000000000000000000000000000000000001',
        10,
        { from: carol },
      );
      await expectRevert.unspecified(
        this.mtcd.register(
          carol,
          '0x0000000000000000000000000000000000000001',
          10,
          { from: carol },
        ),
      );
    });
    it('should revert if not enough tokens', async () => {
      await expectRevert.unspecified(
        this.mtcd.register(
          carol,
          '0x0000000000000000000000000000000000000000',
          1001,
          { from: carol },
        ),
      );
    });
  });
  context('Get', () => {
    const key1 = web3.utils.soliditySha3('some key');
    beforeEach(async () => {
      await this.mtcd.register(
        owner,
        '0x0000000000000000000000000000000000000000',
        10,
        { from: owner },
      );
      await this.mtcd.register(
        alice,
        '0x0000000000000000000000000000000000000000',
        20,
        { from: alice },
      );
      await this.mtcd.register(
        bob,
        '0x0000000000000000000000000000000000000000',
        30,
        { from: bob },
      );
      await this.mtcd.register(
        carol,
        '0x0000000000000000000000000000000000000000',
        40,
        { from: carol },
      );
    });
    it('should revert if value less than query', async () => {
      await expectRevert.unspecified(
        this.mtcd.query(
          '0x5000000000000000000000000000000000000000000000000000000000000000',
        ),
      );
    });
    it('should return value and get eth when date retrieved', async () => {
      await this.mtcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 100,
        },
      );
      (await web3.eth.getBalance(this.mtcd.address)).should.eq('100');
    });
    it('should distribute value when someone call', async () => {
      // Carol join owner
      await this.mtcd.stake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        { from: carol },
      );
      await this.mtcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 100,
        },
      );
      await this.mtcd.distributeFee(100, { from: owner });

      (await this.comm.unlockedBalanceOf(owner)).toNumber().should.eq(990);
      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(980);
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(970);
      (await this.comm.unlockedBalanceOf(carol)).toNumber().should.eq(950);
      (await this.mtcd.getStake(alice, alice)).toNumber().should.eq(20);

      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000);

      (await this.mtcd.getStake(owner, carol)).toNumber().should.eq(18);

      await this.mtcd.unstake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        {
          from: carol,
        },
      );

      (await this.comm.balanceOf(carol)).toNumber().should.eq(1008);
      (await this.comm.unlockedBalanceOf(carol)).toNumber().should.eq(968);

      await this.mtcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 101,
        },
      );

      await this.mtcd.distributeFee(100, { from: owner });

      (await this.mtcd.getStake(alice, alice)).toNumber().should.eq(20);
      (await this.mtcd.getStake(owner, owner)).toNumber().should.eq(68);
      await this.mtcd.unstake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        {
          from: owner,
        },
      );

      (await this.comm.unlockedBalanceOf(owner)).toNumber().should.eq(1019);
      (await this.comm.balanceOf(owner)).toNumber().should.eq(1058);

      await this.mtcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 100,
        },
      );
      await this.mtcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 100,
        },
      );
      await this.mtcd.distributeFee(200, { from: owner });
      (await this.mtcd.getStake(alice, alice)).toNumber().should.eq(20);

      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(980);
      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000);

      (await this.mtcd.getOwnership(alice, alice)).toNumber().should.eq(20);
      await this.mtcd.unstake(
        alice,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        20,
        {
          from: alice,
        },
      );

      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(1000);
      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000);
    });
    it('should accept even if contain non active providers', async () => {
      const topProviders = [carol, bob, alice, owner].sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      const timeStamp = await time.latest();
      const val = 9999;
      const [vs, rs, ss] = [[], [], []];
      for (let i = 0; i < topProviders.length; i++) {
        const sig = await sign(
          key1,
          val,
          timeStamp,
          this.mtcd.address,
          topProviders[i],
        );
        vs.push(sig.v);
        rs.push(sig.r);
        ss.push(sig.s);
      }
      await this.mtcd.report(key1, val, timeStamp, 1, vs, rs, ss);
      await this.queryMock.query(key1, { from: owner, value: 100 });
      parseInt(await this.queryMock.result()).should.eq(9999);
    });
    it('should not accept if contain not enough active providers', async () => {
      const topProviders = [carol, bob, owner].sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      const timeStamp = await time.latest();
      const val = 9999;
      const [vs, rs, ss] = [[], [], []];
      for (let i = 0; i < topProviders.length; i++) {
        const sig = await sign(
          key1,
          val,
          timeStamp,
          this.mtcd.address,
          topProviders[i],
        );
        vs.push(sig.v);
        rs.push(sig.r);
        ss.push(sig.s);
      }
      await expectRevert.unspecified(
        this.mtcd.report(key1, val, timeStamp, 1, vs, rs, ss),
      );
    });
    it('should be able to report and get median', async () => {
      const topProviders = [carol, bob, alice].sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      const timeStamp = await time.latest();
      const val = 9999;
      const [vs, rs, ss] = [[], [], []];
      for (let i = 0; i < topProviders.length; i++) {
        const sig = await sign(
          key1,
          val,
          timeStamp,
          this.mtcd.address,
          topProviders[i],
        );
        vs.push(sig.v);
        rs.push(sig.r);
        ss.push(sig.s);
      }
      await this.mtcd.report(key1, val, timeStamp, 1, vs, rs, ss);
      await this.queryMock.query(key1, { from: owner, value: 100 });
      parseInt(await this.queryMock.result()).should.eq(9999);
    });
    it('should be able to report and get majority', async () => {
      const topProviders = [carol, bob, alice].sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      const timeStamp = await time.latest();
      const val = 1111;
      const [vs, rs, ss] = [[], [], []];
      for (let i = 0; i < topProviders.length; i++) {
        const sig = await sign(
          key1,
          1111,
          timeStamp,
          this.mtcd.address,
          topProviders[i],
        );
        vs.push(sig.v);
        rs.push(sig.r);
        ss.push(sig.s);
      }
      await this.mtcd.report(key1, val, timeStamp, 1, vs, rs, ss);
      await this.queryMock.query(key1, { from: owner, value: 100 });
      parseInt(await this.queryMock.result()).should.eq(1111);
    });
    it('should fail if signers are not in ascending order', async () => {
      const topProviders = [carol, bob, alice].sort((a, b) => {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      });
      const timeStamp = await time.latest();
      const [vs, rs, ss] = [[], [], []];
      const val = 1111;
      for (let i = 0; i < topProviders.length; i++) {
        const sig = await sign(
          key1,
          val,
          timeStamp,
          this.mtcd.address,
          topProviders[i],
        );
        vs.push(sig.v);
        rs.push(sig.r);
        ss.push(sig.s);
      }
      await expectRevert.unspecified(
        this.mtcd.report(key1, val, timeStamp, 1, vs, rs, ss),
      );
    });
    it('should fail if timeStamp is newer than now', async () => {
      const topProviders = [carol, bob, alice].sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      const timeStamp = (await time.latest()) + 1000;
      const [vs, rs, ss] = [[], [], []];
      for (let i = 0; i < topProviders.length; i++) {
        const sig = await sign(
          key1,
          9999,
          timeStamp,
          this.mtcd.address,
          topProviders[i],
        );
        vs.push(sig.v);
        rs.push(sig.r);
        ss.push(sig.s);
      }
      await expectRevert.unspecified(
        this.mtcd.report(key1, 9999, timeStamp, 1, vs, rs, ss),
      );
    });
    it('should fail if there is a signature which is not from top provider', async () => {
      const topProviders = [carol, bob, owner].sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      const timeStamp = await time.latest();
      const [vs, rs, ss] = [[], [], []];
      for (let i = 0; i < topProviders.length; i++) {
        const sig = await sign(
          key1,
          9999,
          timeStamp,
          this.mtcd.address,
          topProviders[i],
        );
        vs.push(sig.v);
        rs.push(sig.r);
        ss.push(sig.s);
      }
      await expectRevert.unspecified(
        this.mtcd.report(key1, 9999, timeStamp, 1, vs, rs, ss),
      );
    });
    it('should fail if number of signatures is <= 2/3', async () => {
      const topProviders = [carol].sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      const timeStamp = await time.latest();
      const [vs, rs, ss] = [[], [], []];
      for (let i = 0; i < topProviders.length; i++) {
        const sig = await sign(
          key1,
          9999,
          timeStamp,
          this.mtcd.address,
          topProviders[i],
        );
        vs.push(sig.v);
        rs.push(sig.r);
        ss.push(sig.s);
      }
      await expectRevert.unspecified(
        this.mtcd.report(key1, 9999, timeStamp, 1, vs, rs, ss),
      );
    });
    it('should be able to report if more than 2/3 have signed', async () => {
      await this.params.setRaw(
        [web3.utils.fromAscii('data:max_provider_count')],
        [4],
        { from: owner },
      );

      // Activate carol first
      await this.mtcd.stake(
        carol,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        0,
        { from: carol },
      );
      let topProviders = [carol, bob].sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      let timeStamp = await time.latest();
      let [vs, rs, ss] = [[], [], []];
      for (let i = 0; i < topProviders.length; i++) {
        const sig = await sign(
          key1,
          1111,
          timeStamp,
          this.mtcd.address,
          topProviders[i],
        );
        vs.push(sig.v);
        rs.push(sig.r);
        ss.push(sig.s);
      }
      await expectRevert.unspecified(
        this.mtcd.report(key1, 1111, timeStamp, 1, vs, rs, ss),
      );

      topProviders = [carol, bob, owner].sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      timeStamp = await time.latest();
      [vs, rs, ss] = [[], [], []];
      for (let i = 0; i < topProviders.length; i++) {
        const sig = await sign(
          key1,
          1111,
          timeStamp,
          this.mtcd.address,
          topProviders[i],
        );
        vs.push(sig.v);
        rs.push(sig.r);
        ss.push(sig.s);
      }
      await this.mtcd.report(key1, 1111, timeStamp, 1, vs, rs, ss);
      await this.queryMock.query(key1, { from: owner, value: 100 });
      parseInt(await this.queryMock.result()).should.eq(1111);
    });
  });
});
