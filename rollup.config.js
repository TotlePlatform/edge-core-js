import babel from 'rollup-plugin-babel'
import flowEntry from 'rollup-plugin-flow-entry'

import packageJson from './package.json'

const external = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.devDependencies),
  '@babel/runtime/regenerator',
  'react-native',
  'react-native-fast-crypto'
]

export default {
  external,
  input: ['src/core/client-side.js', 'src/index.js', 'src/react-native.js'],
  output: { dir: 'lib/', format: 'cjs', sourcemap: true },
  plugins: [babel(), flowEntry()]
}
