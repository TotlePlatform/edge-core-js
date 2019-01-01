// @flow

// import URL from 'url-parse'
import { Bridge, bridgifyObject } from 'yaob'

import { makeContext } from '../../modules/root.js'
import { type EdgeContextOptions, type EdgeIo } from '../../types/types.js'

export const rootApi = {
  async makeEdgeContext (io: EdgeIo, opts: EdgeContextOptions) {
    // if (frameUrl.origin !== parentUrl.origin) opts.hideKeys = true
    return makeContext(io, opts)
  }
}
bridgifyObject(rootApi)

export function sendRoot () {
  // const frameUrl = new URL(window.location)
  const parentUrl = new URL(document.referrer)
  const origin = parentUrl.origin

  const server = new Bridge({
    sendMessage (message) {
      window.parent.postMessage(JSON.parse(JSON.stringify(message)), origin)
    }
  })

  window.addEventListener('message', event => {
    if (event.origin !== origin) return
    // console.log('frame got', event.data)

    server.handleMessage(event.data)
  })

  server.sendRoot(rootApi)
}
