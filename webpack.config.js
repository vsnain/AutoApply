const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './background.js',
    popup: './popup.js',
    // Add more entry points for your extension scripts if needed
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'popup.html', to: 'popup.html' },
        // Add more patterns for other static files (e.g., icons, manifest.json)
      ],
    }),
  ],
};