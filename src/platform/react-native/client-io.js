// @flow

import { makeReactNativeDisklet } from 'disklet'
import { NativeModules } from 'react-native'
import { scrypt } from 'react-native-fast-crypto'
import { bridgifyObject } from 'yaob'

import type { ClientIo } from './server-api.js'

const randomBytes = NativeModules.RNRandomBytes.randomBytes

export function makeClientIo (): Promise<ClientIo> {
  const disklet = makeReactNativeDisklet()
  bridgifyObject(disklet)

  const fakeConsole = {
    info: (...args) => console.info(...args),
    error: (...args) => console.error(...args),
    warn: (...args) => console.warn(...args)
  }
  bridgifyObject(fakeConsole)

  return new Promise((resolve, reject) => {
    randomBytes(32, (error, base64String) => {
      if (error) return reject(error)

      const io = {
        console: fakeConsole,
        disklet,
        entropy: base64String,
        scrypt,
        fetch: async (...args) => {
          const out = await window.fetch(...args)
          bridgifyObject(out)
          return out
        }
      }
      bridgifyObject(io)
      resolve(io)
    })
  })
}
