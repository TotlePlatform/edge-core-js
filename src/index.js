// @flow

import { makeContext } from './core/daemon-side.js'
import { makeBrowserIo } from './io/browser/browser-io.js'
import { isNode, makeNodeIo } from './io/node/node-io.js'
import { type EdgeContext, type EdgeContextOptions } from './types/types.js'

/**
 * Initializes the Edge core library,
 * automatically selecting the appropriate platform.
 */
export function makeEdgeContext (
  opts: EdgeContextOptions
): Promise<EdgeContext> {
  if (isNode) {
    const { path = './edge' } = opts
    return makeContext(makeNodeIo(path), opts)
  }
  return makeContext(makeBrowserIo(), opts)
}

export { makeBrowserIo, makeNodeIo }
export { internal } from './internal.js'
export * from './core/daemon-side.js'
export * from './types/types.js'
