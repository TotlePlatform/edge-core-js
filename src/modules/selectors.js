// @flow
import type { RootState } from './rootReducer.js'

export { getExchangeRate } from './exchange/selectors.js'

export { scrypt, makeSnrp, userIdSnrp } from './scrypt/selectors.js'

export {
  getStorageWalletLastSync,
  getStorageWalletFolder,
  getStorageWalletLocalFolder,
  hashStorageWalletFilename
} from './storage/selectors.js'

export function getIo (state: RootState) {
  return state.io
}

export function getOnError (state: RootState) {
  return state.onError
}