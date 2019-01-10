// @flow

import * as internal from './internal.js'
import { addEdgeCorePlugins } from './modules/root.js'
import { changellyPlugin } from './modules/swap/changelly-plugin.js'
import { changenowPlugin } from './modules/swap/changenow-plugin'
import { faastPlugin } from './modules/swap/faast-plugin.js'
import { shapeshiftPlugin } from './modules/swap/shapeshift-plugin.js'
import * as error from './types/error.js'

addEdgeCorePlugins({
  changelly: changellyPlugin,
  changenow: changenowPlugin,
  faast: faastPlugin,
  shapeshift: shapeshiftPlugin
})

// Sub-module exports:
export { error }
export { internal }
export * from './types/types.js'

// Ancillary exports:
export { makeBrowserIo } from './io/browser/browser-io.js'
export { makeFakeIos } from './io/fake/fake-io.js'
export { makeNodeIo } from './io/node/node-io.js'
export { makeReactNativeIo } from './io/react-native/react-native-io.js'
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
