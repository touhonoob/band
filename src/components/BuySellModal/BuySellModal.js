import React from 'react'
import { connect } from 'react-redux'
import BuySellModalRender from './BuySellModalRender'
import { buyToken, sellToken } from 'actions'
import { bandBalanceSelector } from 'selectors/balances'
import { communityDetailSelector } from 'selectors/communities'
import { currentCommunityClientSelector } from 'selectors/current'
import { communityBalanceSelector } from 'selectors/balances'
import BN from 'utils/bignumber'
import { Utils } from 'band.js'
import { isPositiveNumber } from 'utils/helper'

class BuySellModal extends React.Component {
  state = {
    buy: {
      amount: '',
      price: '0', // CANNOT CALCULATE PRICE, number
      priceLimit: '',
      priceChange: '',
      amountStatus: null, // INVALID_AMOUNT, INSUFFICIENT_TOKEN, OK
      priceStatus: 'OK', // INSUFFICIENT_BAND, OK
      priceLimitStatus: 'OK', //INVALID_PRICELIMIT, INSUFFICIENT_BUYPRICE, INSUFFICIENT_SELLPRICE, OK
    },
    sell: {
      amount: '',
      price: '0', // CANNOT CALCULATE PRICE, number
      priceLimit: '',
      priceChange: '',
      amountStatus: null, // INVALID_AMOUNT, INSUFFICIENT_TOKEN, OK
      priceStatus: 'OK',
      priceLimitStatus: 'OK', //INVALID_PRICELIMIT, INSUFFICIENT_BUYPRICE, INSUFFICIENT_SELLPRICE, OK
    },
    type: 'buy', // 'buy' | 'sell'
    showAdvance: false,
    loading: false,
  }

  componentDidMount() {
    this.setState({ type: this.props.type })
  }

  async setType(type) {
    this.setState(
      {
        type,
      },
      () => this.updateAllstate(),
    )
  }

  toggleAdvance() {
    this.setState({
      showAdvance: !this.state.showAdvance,
    })
  }

  onButtonClick() {
    const { type } = this.state
    const { amount, priceLimit, price } = this.state[type]
    const { onBuy, onSell } = this.props
    // console.log(
    //   'Clicked',
    //   type,
    //   BN.parse(parseFloat(amount)).toString(),
    //   priceLimit !== '' ? BN.parse(parseFloat(priceLimit)) : price,
    // )
    if (type === 'buy') {
      onBuy(
        BN.parse(parseFloat(amount)),
        priceLimit !== '' ? BN.parse(parseFloat(priceLimit)) : price,
      )
    } else {
      onSell(
        BN.parse(parseFloat(amount)),
        priceLimit !== '' ? BN.parse(parseFloat(priceLimit)) : price,
      )
    }
  }

  async checkAmount(amount, type) {
    if (amount === '') {
      this.setState({
        [type]: {
          ...this.state[type],
          price: new BN('0'),
          amountStatus: null,
          priceStatus: null,
        },
      })
      return null
    }
    let amountStatusChecking = false
    try {
      amountStatusChecking = Utils.toBlockchainUnit(this.state[type].amount).gt(
        this.props.tokenBalance,
      )
    } catch (e) {
      amountStatusChecking = false
    }
    if (isPositiveNumber(amount)) {
      this.setState({
        [type]: {
          ...this.state[type],
          amountStatus:
            type === 'sell' && amountStatusChecking
              ? 'INSUFFICIENT_TOKEN'
              : 'OK',
        },
        loading: true,
      })
      await this.updatePrice()
      return null
    }

    this.setState({
      [type]: {
        ...this.state[type],
        amountStatus: 'INVALID_AMOUNT',
      },
      loading: false,
    })
  }

  checkPriceLimit(priceLimit, type) {
    if (priceLimit === '') {
      this.setState({
        [type]: {
          ...this.state[type],
          priceLimitStatus: 'OK',
        },
      })
      return null
    }

    if (isPositiveNumber(priceLimit)) {
      const priceLimitBN = Utils.toBlockchainUnit(priceLimit)
      this.setState({
        [type]: {
          ...this.state[type],
          priceLimitStatus:
            type === 'buy' && this.state[type].price.gt(priceLimitBN)
              ? 'INSUFFICIENT_BUYPRICE'
              : type === 'sell' && priceLimitBN.gt(this.state[type].price)
              ? 'INSUFFICIENT_SELLPRICE'
              : 'OK',
        },
      })
      return null
    }

    this.setState({
      [type]: {
        ...this.state[type],
        priceLimitStatus: 'INVALID_PRICELIMIT',
      },
    })
  }

  async updatePrice() {
    const { communityClient, bandBalance } = this.props
    const { type } = this.state
    const { amount } = this.state[type]

    try {
      const price =
        type === 'buy'
          ? await communityClient.getBuyPrice(BN.parse(parseFloat(amount)))
          : await communityClient.getSellPrice(BN.parse(parseFloat(amount)))
      this.setState({
        [type]: {
          ...this.state[type],
          price,
          priceStatus:
            type === 'buy' && price.gt(bandBalance)
              ? 'INSUFFICIENT_BAND'
              : 'OK',
        },
        loading: false,
      })
    } catch {
      this.setState({
        [type]: {
          ...this.state[type],
          amountStatus: 'INVALID_AMOUNT',
        },
        loading: false,
      })
    }
  }

  async updateAllstate() {
    const { type } = this.state
    const { amount, priceLimit } = this.state[type]
    await this.checkAmount(amount, type)
    this.checkPriceLimit(priceLimit, type)
  }

  async handleChange(what, e) {
    const { value } = e.target
    const { type } = this.state
    this.setState({
      [type]: {
        ...this.state[type],
        [what]: value,
      },
    })

    if (this.checker) clearTimeout(this.checker)
    this.checker = setTimeout(() => {
      delete this.checker
      this.updateAllstate()
    }, 200)
  }

  render() {
    const { name, logo, symbol, tokenNormalPrice } = this.props
    const { type, showAdvance, loading } = this.state
    const currentType = this.state[type]
    return (
      <BuySellModalRender
        name={name}
        logo={logo}
        symbol={symbol}
        type={type}
        amount={currentType.amount}
        tokenNormalPrice={tokenNormalPrice}
        price={currentType.price}
        priceChange={currentType.priceChange}
        priceLimit={currentType.priceLimit}
        amountStatus={currentType.amountStatus}
        priceStatus={currentType.priceStatus}
        priceLimitStatus={currentType.priceLimitStatus}
        loading={loading}
        handleChange={this.handleChange.bind(this)}
        setType={this.setType.bind(this)}
        showAdvance={showAdvance}
        toggleAdvance={this.toggleAdvance.bind(this)}
        onButtonClick={this.onButtonClick.bind(this)}
      />
    )
  }
}

const mapStateToProps = (state, { type, tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })
  if (!community) return {}
  return {
    name: community.get('name'),
    logo: community.get('logo'),
    symbol: community.get('symbol'),
    bandBalance: bandBalanceSelector(state),
    tokenBalance: communityBalanceSelector(state, { address: tokenAddress }),
    tokenNormalPrice: community.get('price'),
    type: type,
    communityClient: currentCommunityClientSelector(state, {
      address: tokenAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  onBuy: (amount, priceLimit) =>
    dispatch(buyToken(tokenAddress, amount, priceLimit)),
  onSell: (amount, priceLimit) =>
    dispatch(sellToken(tokenAddress, amount, priceLimit)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BuySellModal)
