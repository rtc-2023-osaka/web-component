// const path = require('path');
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  target: 'web',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'docs/examples/dist'),
    filename: 'pose-camera.js'
  },
  resolve: {
    fallback: {
      "fs": false,
      "path": false,
      "crypto": false
    },
  },

  mode: 'development',

  devServer: {
    hot: true,
    writeToDisk: true,
    contentBase: path.join(__dirname, 'docs/'),
    compress: true,
    port: 9000,
  },

};