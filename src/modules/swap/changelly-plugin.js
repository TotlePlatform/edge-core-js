// @flow

import { lt, mul } from 'biggystring'
import { base16 } from 'rfc4648'

import { SwapBelowLimitError, SwapCurrencyError } from '../../types/error.js'
import {
  type EdgeCurrencyWallet,
  type EdgePluginEnvironment,
  type EdgeSwapPlugin,
  type EdgeSwapPluginQuote,
  type EdgeSwapRequest,
  type EdgeSwapTools
} from '../../types/types.js'
import { hmacSha512 } from '../../util/crypto/crypto.js'
import { utf8 } from '../../util/encoding.js'
import { makeSwapPluginQuote } from './swap-helpers.js'

const swapInfo = {
  pluginName: 'changelly',
  displayName: 'Changelly',

  // quoteUri: 'https://changelly.com/transaction/',
  supportEmail: 'support@changelly.com'
}

const uri = 'https://api.changelly.com'
const expirationMs = 1000 * 60 * 20

type QuoteInfo = {
  id: string,
  apiExtraFee: string,
  changellyFee: string,
  payinExtraId: string | null,
  payoutExtraId: string | null,
  amountExpectedFrom: number,
  status: 'new',
  currencyFrom: string,
  currencyTo: string,
  amountTo: number,
  payinAddress: string,
  payoutAddress: string,
  createdAt: string
}

const dontUseLegacy = {
  DGB: true
}

async function getAddress (
  wallet: EdgeCurrencyWallet,
  currencyCode: string
): Promise<string> {
  const addressInfo = await wallet.getReceiveAddress({ currencyCode })
  return addressInfo.legacyAddress && !dontUseLegacy[currencyCode]
    ? addressInfo.legacyAddress
    : addressInfo.publicAddress
}

function checkReply (reply: Object, request?: EdgeSwapRequest) {
  if (reply.error != null) {
    if (
      request != null &&
      (reply.error.code === -32602 ||
        /Invalid currency:/.test(reply.error.message))
    ) {
      throw new SwapCurrencyError(
        swapInfo,
        request.fromCurrencyCode,
        request.toCurrencyCode
      )
    }

    throw new Error('Changelly error: ' + JSON.stringify(reply.error))
  }
}

function makeChangellyTools (env): EdgeSwapTools {
  const { initOptions = {}, io } = env

  if (initOptions.apiKey == null || initOptions.secret == null) {
    throw new Error('No Changelly apiKey or secret provided.')
  }
  const { apiKey } = initOptions
  const secret = utf8.parse(initOptions.secret)

  async function call (json: any) {
    const body = JSON.stringify(json)
    const sign = base16
      .stringify(hmacSha512(utf8.parse(body), secret))
      .toLowerCase()

    io.console.info('changelly call:', json)
    const headers = {
      'Content-Type': 'application/json',
      'api-key': apiKey,
      sign
    }
    const reply = await io.fetch(uri, { method: 'POST', body, headers })
    if (!reply.ok) {
      throw new Error(`Changelly returned error code ${reply.status}`)
    }
    const out = await reply.json()
    io.console.info('changelly reply:', out)
    return out
  }

  const out: EdgeSwapTools = {
    needsActivation: false,

    async changeUserSettings (userSettings: Object): Promise<mixed> {},

    async fetchCurrencies (): Promise<Array<string>> {
      const reply = await call({
        jsonrpc: '2.0',
        id: 1,
        method: 'getCurrencies',
        params: {}
      })
      checkReply(reply)
      return reply.result.map(code => code.toUpperCase())
    },

    async fetchQuote (request: EdgeSwapRequest): Promise<EdgeSwapPluginQuote> {
      // Grab addresses:
      const [fromAddress, toAddress] = await Promise.all([
        getAddress(request.fromWallet, request.fromCurrencyCode),
        getAddress(request.toWallet, request.toCurrencyCode)
      ])

      // Convert the native amount to a denomination:
      const quoteAmount =
        request.quoteFor === 'from'
          ? await request.fromWallet.nativeToDenomination(
            request.nativeAmount,
            request.fromCurrencyCode
          )
          : await request.toWallet.nativeToDenomination(
            request.nativeAmount,
            request.toCurrencyCode
          )

      // Swap the currencies if we need a reverse quote:
      const quoteParams =
        request.quoteFor === 'from'
          ? {
            from: request.fromCurrencyCode,
            to: request.toCurrencyCode,
            amount: quoteAmount
          }
          : {
            from: request.toCurrencyCode,
            to: request.fromCurrencyCode,
            amount: quoteAmount
          }

      // Get the estimate from the server:
      const quoteReplies = await Promise.all([
        call({
          jsonrpc: '2.0',
          id: 'one',
          method: 'getMinAmount',
          params: {
            from: request.fromCurrencyCode,
            to: request.toCurrencyCode
          }
        }),
        call({
          jsonrpc: '2.0',
          id: 'two',
          method: 'getExchangeAmount',
          params: quoteParams
        })
      ])
      checkReply(quoteReplies[0])
      checkReply(quoteReplies[1])

      // Calculate the amounts:
      let fromAmount, fromNativeAmount, toNativeAmount
      if (request.quoteFor === 'from') {
        fromAmount = quoteAmount
        fromNativeAmount = request.nativeAmount
        toNativeAmount = await request.toWallet.denominationToNative(
          quoteReplies[1].result,
          request.toCurrencyCode
        )
      } else {
        fromAmount = mul(quoteReplies[1].result, '1.02')
        fromNativeAmount = await request.fromWallet.denominationToNative(
          fromAmount,
          request.fromCurrencyCode
        )
        toNativeAmount = request.nativeAmount
      }

      // Check the minimum:
      const nativeMin = await request.fromWallet.denominationToNative(
        quoteReplies[0].result,
        request.fromCurrencyCode
      )
      if (lt(fromNativeAmount, nativeMin)) {
        throw new SwapBelowLimitError(swapInfo, nativeMin)
      }

      // Get the address:
      const sendReply = await call({
        jsonrpc: '2.0',
        id: 3,
        method: 'createTransaction',
        params: {
          amount: fromAmount,
          from: request.fromCurrencyCode,
          to: request.toCurrencyCode,
          address: toAddress,
          extraId: null, // TODO: Do we need this for Monero?
          refundAddress: fromAddress,
          refundExtraId: null
        }
      })
      checkReply(sendReply)
      const quoteInfo: QuoteInfo = sendReply.result

      // Make the transaction:
      const spendInfo = {
        currencyCode: request.fromCurrencyCode,
        spendTargets: [
          {
            nativeAmount: fromNativeAmount,
            publicAddress: quoteInfo.payinAddress,
            otherParams: {
              uniqueIdentifier: quoteInfo.payinExtraId
            }
          }
        ]
      }
      io.console.info('changelly spendInfo', spendInfo)
      const tx = await request.fromWallet.makeSpend(spendInfo)

      return makeSwapPluginQuote(
        request,
        fromNativeAmount,
        toNativeAmount,
        tx,
        toAddress,
        'changelly',
        new Date(Date.now() + expirationMs),
        quoteInfo.id
      )
    }
  }

  return out
}

export const changellyPlugin: EdgeSwapPlugin = {
  pluginType: 'swap',
  swapInfo,

  async makeTools (env: EdgePluginEnvironment): Promise<EdgeSwapTools> {
    return makeChangellyTools(env)
  }
}
