import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    // CommonJS
    { file: pkg.main, format: 'cjs' },

    // ES
    { file: pkg.module, format: 'es' },

    // UMD
    {
      file: pkg.browser,
      format: 'umd',
      name: 'AutomaticAnalyticsTrigger',
      indent: false,
      plugins: [terser()],
    },
  ],
};
