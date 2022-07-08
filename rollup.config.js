import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'lib',
    format: 'cjs'
  },
  external: ['react', 'xstate', '@xstate/react'],
  plugins: [typescript()]
}