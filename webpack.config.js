var path = require('path');

module.exports = {
  mode: 'development',
  entry: './_transpiled/main.js',
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'browser.js'
  }
};
