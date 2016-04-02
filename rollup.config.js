import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const babelOptions = {
  runtimeHelpers: true,
  presets: ['es2015-rollup', 'stage-2'],
};

const config = {
  moduleName: 'MDM',
  entry:      'src/index.js',
  dest:       'dist/MDM.js',
  sourceMap:  true,
  format:     'umd',
  plugins:    [babel(babelOptions)],
  intro:      'var undefined;',
};


const DEBUG = process.env.NODE_ENV !== 'production';

if (!DEBUG) {
  console.info(`compiling production files (NODE_ENV == ${process.env.NODE_ENV})`);
  config.plugins.push(uglify());
  config.sourceMap = false;
  config.dest = 'dist/MDM.min.js';
}

export default config;
