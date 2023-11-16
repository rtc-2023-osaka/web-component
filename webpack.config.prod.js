const path = require('path');

module.exports = {
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
  mode: 'production'
};