// @flow

import hashjs from 'hash.js'
import HmacDRBG from 'hmac-drbg'
import scryptJs from 'scrypt-js'

/**
 * No-op log.
 */
export const fakeConsole = {
  info: () => {},
  warn: () => {},
  error: () => {}
}

/**
 * A fetch function with no connectivity.
 */
export function fakeFetch () {
  return Promise.reject(new Error('Fake network error'))
}

/**
 * Creates a pseudo-random number generator based on the provided entropy.
 * This can be used to turn an async random number generator into
 * a synchronous one.
 */
export function makeRandomFunction (
  entropy: Uint8Array
): (bytes: number) => Uint8Array {
  const out = new HmacDRBG({
    hash: hashjs.sha256,
    entropy: entropy
  })

  return bytes => out.generate(bytes)
}

/**
 * TODO: WebSocket mock.
 */
export class FakeWebSocket {
  on () {}
  close () {}
  send () {}
}
const flowHack: any = FakeWebSocket
flowHack.CLOSED = 3
flowHack.CLOSING = 2
flowHack.CONNECTING = 0
flowHack.OPEN = 1

/**
 * Pure Javascript scrypt implementation.
 */
export function scrypt (
  data: Uint8Array,
  salt: Uint8Array,
  n: number,
  r: number,
  p: number,
  dklen: number
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const callback = (error, progress, key) => {
      if (error) return reject(error)
      if (key) return resolve(key)
    }

    // The scrypt library will crash if it gets a Uint8Array > 64 bytes:
    const copy = []
    for (let i = 0; i < data.length; ++i) copy[i] = data[i]

    scryptJs(copy, salt, n, r, p, dklen, callback)
  })
}
