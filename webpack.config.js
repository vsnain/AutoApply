const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './background.js',
    popup: './popup.js',
    content: './content.js',
    injectScript: './injectScript.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'popup.html', to: 'popup.html' },
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'content.js', to: 'content.js' },
        { from: 'injectScript.js', to: 'injectScript.js' }, // Copy content.bundle.js as content.js
      ],
    }),
  ],
};