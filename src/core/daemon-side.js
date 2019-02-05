// @flow

import { makeFakeIos, prepareFakeIos } from '../io/fake/fake-io.js'
import { fakeUser } from '../io/fake/fakeUser.js'
import { fakeUser1 } from '../io/fake/fakeUser1.js'
import {
  type EdgeContext,
  type EdgeFakeContextOptions
} from '../types/types.js'
import { destroyAllContexts, makeContext } from './root.js'

/**
 * Creates one or more fake Edge core library instances for testing.
 *
 * The instances all share the same virtual server,
 * but each context receives its own options.
 *
 * The virtual server comes pre-populated with a testing account.
 * The credentials for this account are available in the 'fakeUser' export.
 * Setting the `localFakeUser` context option to `true` will enable PIN
 * and offline password login for that particular context.
 */
export async function makeFakeContexts (
  ...opts: Array<EdgeFakeContextOptions>
): Promise<Array<EdgeContext>> {
  return prepareFakeIos(opts).then(ios =>
    Promise.all(ios.map((io, i) => makeContext(io, opts[i])))
  )
}

export { destroyAllContexts, fakeUser, fakeUser1, makeContext, makeFakeIos }
