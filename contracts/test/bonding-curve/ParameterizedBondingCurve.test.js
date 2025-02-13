const { expectRevert, time } = require('openzeppelin-test-helpers');

const BandToken = artifacts.require('BandToken');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');

require('chai').should();

contract('BondingCurve with Parameters', ([_, owner, alice, bob]) => {
  beforeEach(async () => {
    this.registry = await BandRegistry.deployed();
    this.tcdFactory = await CommunityFactory.deployed();
    this.band = await BandToken.at(await this.registry.band());
    await this.band.transfer(_, await this.band.balanceOf(owner), {
      from: owner,
    });
    await this.band.transfer(_, await this.band.balanceOf(alice), {
      from: alice,
    });
    await this.band.transfer(_, await this.band.balanceOf(bob), {
      from: bob,
    });

    await this.band.transfer(owner, 1000000, { from: _ });
    await this.band.transfer(alice, 100000, { from: owner });
    await this.band.transfer(bob, 100000, { from: owner });

    const testCurve = await BondingCurveExpression.new([8, 1, 0, 2]);
    const data = await this.tcdFactory.create(
      'CoinHatcher',
      'CHT',
      testCurve.address,
      '0',
      '60',
      '100000000000000000',
      '800000000000000000',
      { from: _ },
    );
    this.comm = await CommunityToken.at(data.receipt.logs[2].args.token);
    this.curve = await BondingCurve.at(data.receipt.logs[2].args.bondingCurve);
    this.params = await Parameters.at(data.receipt.logs[2].args.params);
  });

  context('Checking buy and sell community tokens with f(s) = x ^ 2', () => {
    it('should not allow buying directly without approval', async () => {
      await expectRevert.unspecified(
        this.curve.buy(alice, 100, 11000, { from: alice }),
      );
    });
    it('should not allow buying if buy does not have enough band', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await expectRevert.unspecified(
        this.band.transferAndCall(
          this.curve.address,
          110000,
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });

    it('should not allow buying if price limit does not pass', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await expectRevert.unspecified(
        this.band.transferAndCall(
          this.curve.address,
          9000,
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });

    it('should allow buying tokens if calling via band tokens', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.curve.address,
        11000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('90000');
      (await this.comm.balanceOf(alice)).toString().should.eq('100');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });

    it('should time.increase price for subsequent purchases', async () => {
      const calldata1 = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.curve.address,
        11000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );
      const calldata2 = this.curve.contract.methods.buy(_, 0, 10).encodeABI();
      await this.band.transferAndCall(
        this.curve.address,
        11000,
        '0x' + calldata2.slice(2, 10),
        '0x' + calldata2.slice(138),
        { from: bob },
      );
      (await this.band.balanceOf(bob)).toString().should.eq('97900');
      (await this.comm.balanceOf(bob)).toString().should.eq('10');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });

    it('should allow selling with correct price drop', async () => {
      const calldata1 = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.curve.address,
        11000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );
      const calldata2 = this.curve.contract.methods
        .sell(_, 0, 10000)
        .encodeABI();
      await expectRevert.unspecified(
        this.comm.transferAndCall(
          this.curve.address,
          10,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: alice },
        ),
      );
      const calldata3 = this.curve.contract.methods
        .sell(_, 0, 1000)
        .encodeABI();
      await this.comm.transferAndCall(
        this.curve.address,
        10,
        '0x' + calldata3.slice(2, 10),
        '0x' + calldata3.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('91900');
      (await this.comm.balanceOf(alice)).toString().should.eq('90');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });
  });

  context('Checking auto-inflation feature', () => {
    beforeEach(async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.curve.address,
        20000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
    });

    it('should inflate 10% per month properly after a purchase', async () => {
      // 10% per month inflation
      await this.params.propose(
        '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
        [web3.utils.fromAscii('bonding:inflation_rate')],
        [38580246914],
        {
          from: owner,
        },
      );
      await this.params.vote(0, true, {
        from: alice,
      });
      await time.increase(time.duration.days(30));
      const calldata = this.curve.contract.methods.buy(_, 0, 10).encodeABI();
      await this.band.transferAndCall(
        this.curve.address,
        20000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('88100');
      (await this.comm.balanceOf(alice)).toString().should.eq('110');
      (await this.comm.balanceOf(_)).toString().should.eq('10');
      (await this.comm.totalSupply()).toString().should.eq('120');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('826388888888888888');
    });

    it('should inflate 10% per hour properly after a sale', async () => {
      // 10% per hour inflation
      await this.params.propose(
        '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
        [web3.utils.fromAscii('bonding:inflation_rate')],
        [27777777777778],
        {
          from: owner,
        },
      );

      await this.params.vote(0, true, {
        from: alice,
      });
      await time.increase(time.duration.hours(1));
      // First sale
      await time.increase(time.duration.hours(9));
      const calldata = this.curve.contract.methods.sell(_, 0, 0).encodeABI();
      await this.comm.transferAndCall(
        this.curve.address,
        10,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('90975');
      (await this.comm.balanceOf(alice)).toString().should.eq('90');
      (await this.comm.balanceOf(_)).toString().should.eq('100');
      (await this.comm.totalSupply()).toString().should.eq('190');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('250000000000000000');
      // Second sale
      await time.increase(time.duration.hours(10));
      await this.comm.transferAndCall(
        this.curve.address,
        10,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('91444');
      (await this.comm.balanceOf(alice)).toString().should.eq('80');
      (await this.comm.balanceOf(_)).toString().should.eq('290');
      (await this.comm.totalSupply()).toString().should.eq('370');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('62498173849525200');
    });
  });

  context('Checking liquidity fee', () => {
    beforeEach(async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.curve.address,
        20000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      // 20% liquidity fee
      await this.params.propose(
        '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
        [web3.utils.fromAscii('bonding:liquidity_spread')],
        [200000000000],
        {
          from: alice,
        },
      );

      await this.params.vote(0, true, {
        from: alice,
      });
      await time.increase(time.duration.seconds(120));
    });

    it('should impose commission on purchases', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 15).encodeABI();
      await this.band.transferAndCall(
        this.curve.address,
        10000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('86775');
      (await this.comm.balanceOf(alice)).toString().should.eq('115');
      (await this.comm.balanceOf(this.curve.address)).toString().should.eq('0');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });

    it('should not impose commission on sales', async () => {
      const calldata = this.curve.contract.methods.sell(_, 0, 1000).encodeABI();
      await this.comm.transferAndCall(
        this.curve.address,
        15,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('92775');
      (await this.comm.balanceOf(alice)).toString().should.eq('85');
      (await this.comm.balanceOf(this.curve.address)).toString().should.eq('0');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });
  });

  context('Checking deflation feature', () => {
    beforeEach(async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.curve.address,
        100000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: owner },
      );
      await this.band.transferAndCall(
        this.curve.address,
        100000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      await this.comm.approve(this.curve.address, 100, { from: owner });
    });

    it('should not allow deflate more than what they own', async () => {
      await expectRevert.unspecified(
        this.curve.deflate(owner, 110, { from: owner }),
      );
    });

    it('should allow anyone to deflate', async () => {
      await this.curve.deflate(owner, 10, { from: owner });
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1108033240997229916');
    });
  });
});
