// This file exists to hide the React Native dependencies from flow.

import { NativeModules, Platform } from 'react-native'
import { pbkdf2, scrypt, secp256k1 } from 'react-native-fast-crypto'

// Hack around networking stuff:
const net = require('react-native-tcp')
const tls = require('react-native-tcp/tls')
const Socket = net.Socket
const TLSSocket =
  Platform.OS === 'android' ? void 0 : tls.TLSSocket || tls.Socket
const randomBytes = NativeModules.RNRandomBytes.randomBytes

export { pbkdf2, randomBytes, scrypt, secp256k1, Socket, TLSSocket }
