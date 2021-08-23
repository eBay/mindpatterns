const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: './_transpiled/main.js',
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'browser.js'
  },
  plugins: [new MiniCssExtractPlugin({
    filename: 'skin.css'
  })],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
