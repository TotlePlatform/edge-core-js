// @flow

import { makeContext } from './core/daemon-side.js'
import { makeReactNativeIo } from './io/react-native/react-native-io.js'
import { type EdgeContext, type EdgeContextOptions } from './types/types.js'

/**
 * Initializes the Edge core library,
 * automatically selecting the appropriate platform.
 */
export function makeEdgeContext (
  opts: EdgeContextOptions
): Promise<EdgeContext> {
  return makeReactNativeIo().then(io => makeContext(io, opts))
}

export { makeReactNativeIo }
export { internal } from './internal.js'
export * from './core/daemon-side.js'
export * from './types/types.js'
