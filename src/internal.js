// @flow

// We are exporting some internal goodies for the CLI,
// which makes use of some undocumented core features.
// In the future we hope to minimize / reduce this

import { hmacSha256 } from './util/crypto/crypto.js'
import { base58, utf8 } from './util/encoding.js'
import { filterObject, mergeDeeply, softCat } from './util/util.js'

export const internal = {
  base58,
  filterObject,
  hmacSha256,
  mergeDeeply,
  softCat,
  utf8
}
