import typescriptPlugin from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import progress from 'rollup-plugin-progress'

import pkg from './package.json'

export default {
  input: './src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'auto',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'auto',
      sourcemap: true,
    },
  ],
  plugins: [
    progress(),
    external(),
    postcss({
      inject: true,
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        camelCase: true,
      },
    }),
    url(),
    svgr(),
    resolve(),
    typescriptPlugin({
      rollupCommonJSResolveHack: true,
      clean: true,
    }),
    commonjs(),
  ],
}
