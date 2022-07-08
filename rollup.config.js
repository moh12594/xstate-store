import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import external from 'rollup-plugin-peer-deps-external'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'lib',
    format: 'cjs'
  },
  external: ['react', 'xstate', '@xstate/react'],
  plugins: [
    external(),
    typescript(),
    terser(),
    filesize()
  ]
}