const path = require('path')
var webpackconfig={
    entry: './src/index.js',
    mode:'development',
    output: {      
      filename: 'globalinputmessage-react.js',
      path: __dirname + '/dist'
      
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            exclude: /(node_modules|bower_components|build)/,
            use: {
                loader: 'babel-loader',
                options: {
                presets: ['@babel/env']
            }
        }
        }]
    }
  };
module.exports = webpackconfig;

  