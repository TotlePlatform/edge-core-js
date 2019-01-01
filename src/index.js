// @flow

import * as internal from './internal.js'
import { addEdgeCorePlugins } from './modules/root.js'
import { makeChangellyPlugin } from './modules/swap/changelly-plugin.js'
import { makeChangeNowPlugin } from './modules/swap/changenow-plugin.js'
import { makeFaastPlugin } from './modules/swap/faast-plugin.js'
import { makeShapeshiftPlugin } from './modules/swap/shapeshift-plugin.js'
import * as error from './types/error.js'

addEdgeCorePlugins({
  changelly: makeChangellyPlugin,
  changenow: makeChangeNowPlugin,
  faast: makeFaastPlugin,
  shapeshift: makeShapeshiftPlugin
})

// Sub-module exports:
export { error }
export { internal }
export * from './types/types.js'

// Ancillary exports:
export { makeBrowserIo } from './io/browser/browser-io.js'
export { makeFakeIos } from './io/fake/fake-io.js'
export { makeNodeIo } from './io/node/node-io.js'
export { addEdgeCorePlugins, lockEdgeCorePlugins } from './modules/root.js'
export {
  DustSpendError,
  errorNames,
  InsufficientFundsError,
  SpendToSelfError,
  NetworkError,
  NoAmountSpecifiedError,
  ObsoleteApiError,
  OtpError,
  PasswordError,
  PendingFundsError,
  SameCurrencyError,
  SwapAboveLimitError,
  SwapBelowLimitError,
  SwapCurrencyError,
  SwapPermissionError,
  UsernameError
} from './types/error.js'
export {
  closeFakeEdgeWorlds,
  makeEdgeContext,
  makeFakeEdgeWorld
} from './makeContext.js'

export function MakeEdgeContext () {}
export function MakeFakeEdgeWorld () {}
