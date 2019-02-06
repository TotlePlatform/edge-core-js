// @flow

// Sub-module exports:
import * as internal from './internal.js'
import * as error from './types/error.js'

export { error }
export { internal }
export * from './types/types.js'

// Ancillary exports:
export { makeBrowserIo } from './io/browser/browser-io.js'
export { makeFakeIos } from './io/fake/fake-io.js'
export { makeNodeIo } from './io/node/node-io.js'
export { makeReactNativeIo } from './io/react-native/react-native-io.js'
export { fakeUser } from './io/fake/fakeUser.js'
export { fakeUser1 } from './io/fake/fakeUser1.js'
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
export { makeEdgeContext, makeFakeContexts } from './makeContext.js'
export { destroyAllContexts } from './core/root.js'
