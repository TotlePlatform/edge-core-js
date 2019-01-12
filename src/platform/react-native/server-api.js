// @flow

import { type Disklet } from 'disklet'
import { base64 } from 'rfc4648'
import { bridgifyObject, close } from 'yaob'

import { makeFakeWorld } from '../../modules/fake/fake-world.js'
import { makeContext } from '../../modules/root.js'
import {
  type EdgeConsole,
  type EdgeContext,
  type EdgeContextOptions,
  type EdgeFakeUser,
  type EdgeFakeWorld,
  type EdgeIo,
  type EdgeScryptFunction
} from '../../types/types.js'
import { makeRandomFunction, scrypt } from '../fallback.js'

export type ClientIo = {
  console: EdgeConsole,
  disklet: Disklet,

  entropy: string, // base64
  scrypt: EdgeScryptFunction
}

export type ServerApi = {
  close(): Promise<mixed>,

  makeEdgeContext(
    clientIo: ClientIo,
    opts: EdgeContextOptions
  ): Promise<EdgeContext>,

  makeFakeEdgeWorld(
    clientIo: ClientIo,
    users?: Array<EdgeFakeUser>
  ): Promise<EdgeFakeWorld>
}

function makeIo (clientIo: ClientIo): EdgeIo {
  return {
    console: clientIo.console,
    disklet: clientIo.disklet,

    // fetch: clientIo.fetch,
    fetch: (...args) => window.fetch(...args),
    WebSocket: window.WebSocket,

    random: makeRandomFunction(base64.parse(clientIo.entropy)),
    scrypt,

    // ugh:
    // $FlowFixMe
    pbkdf2: clientIo.pbkdf2,
    // $FlowFixMe
    secp256k1: clientIo.secp256k1,
    // $FlowFixMe
    makeSocket: clientIo.makeSocket
  }
}

const allContexts: Array<EdgeContext> = []
const allWorlds: Array<EdgeFakeWorld> = []

export const serverApi: ServerApi = {
  close (): Promise<mixed> {
    close(this)
    return Promise.all([
      ...allContexts.map(context => context.close()),
      ...allWorlds.map(world => world.close())
    ])
  },

  async makeEdgeContext (clientIo, opts) {
    const out = await makeContext(makeIo(clientIo), opts)
    allContexts.push(out)
    return out
  },

  async makeFakeEdgeWorld (clientIo, users = []) {
    const out = await makeFakeWorld(makeIo(clientIo), users)
    allWorlds.push(out)
    return out
  }
}
bridgifyObject(serverApi)
