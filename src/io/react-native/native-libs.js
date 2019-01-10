// This file exists to hide the React Native dependencies from flow.

// Random numbers:
let randomBytes
try {
  const nativeModules = require('react-native').NativeModules
  randomBytes = nativeModules.RNRandomBytes.randomBytes
} catch (e) {}
export { randomBytes }

// Crypto stuff:
let scrypt
try {
  let crypto = require('react-native-fast-crypto')
  // The React Native bundler seems to have trouble with default exports:
  if (crypto.default && !crypto.scrypt) crypto = crypto.default

  scrypt = crypto.scrypt
} catch (e) {}
export { scrypt }
