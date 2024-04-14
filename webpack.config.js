const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './background.js',
    popup: './popup.js',
    content: './content.js',
    injectScript: './injectScript.js',
    applyScript: './applyScript.js',
    questions: './questions.js', // Add this line
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
        { from: 'injectScript.js', to: 'injectScript.js' },
        { from: 'applyScript.js', to: 'applyScript.js' },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'questions.html', // Output file name
      template: 'questions.html', // Input file
      chunks: ['questions'], // Include the 'questions' chunk
    }),
  ],
};