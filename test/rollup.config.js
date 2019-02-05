import babel from 'rollup-plugin-babel'
import multiEntry from 'rollup-plugin-multi-entry'

import config from '../rollup.config.js'

export default {
  external: config.external,
  input: 'test/**/*.test.js',
  output: [{ file: 'build/tests.js', format: 'cjs', sourcemap: true }],
  plugins: [babel(), multiEntry()]
}
