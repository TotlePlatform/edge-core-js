module.exports = {
  devtool: 'source-map',
  entry: './src/platform/react-native/server.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: 'babel-loader'
      }
    ]
  },
  output: {
    filename: 'lib/react-native/edge-core-server.js'
  }
}
