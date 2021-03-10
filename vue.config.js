const path = require('path');

module.exports = {
  outputDir: path.resolve('../public'),
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
        "/": {
          target: "http://localhost:3000"
        }
      }
  }
}
