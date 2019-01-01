// @flow

import { Bridge, bridgifyObject, close } from 'yaob'

import { makeFakeWorld } from '../../modules/fake/fake-world.js'
import { makeContext } from '../../modules/root.js'
import {
  type EdgeContext,
  type EdgeContextOptions,
  type EdgeFakeUser,
  type EdgeFakeWorld,
  type EdgeIo
} from '../../types/types.js'

const allContexts: Array<EdgeContext> = []
const allWorlds: Array<EdgeFakeWorld> = []

const rootApi = {
  async makeEdgeContext (io: EdgeIo, opts: EdgeContextOptions) {
    const out = await makeContext(io, opts)
    allContexts.push(out)
    return out
  },

  async makeFakeEdgeWorld (
    io: EdgeIo,
    users: Array<EdgeFakeUser> = []
  ): Promise<EdgeFakeWorld> {
    const out = await makeFakeWorld(io, users)
    allWorlds.push(out)
    return out
  },

  close () {
    for (const context of allContexts) context.close()
    for (const world of allWorlds) world.close()
    close(this)
  }
}
bridgifyObject(rootApi)

if (process.send != null) {
  const sendMessage = process.send
  const bridge = new Bridge({ sendMessage })
  process.on('message', message => bridge.handleMessage(message))
  bridge.sendRoot(rootApi)
}
