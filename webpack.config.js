const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AppCachePlugin = require('appcache-webpack-plugin');

const PORT = process.env.PORT;
const config = {

  entry: [
    './client/Index',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
    publicPath: '/',
  },
  devServer: {
    inline: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    port: PORT,
  },
  // Import files without having to include suffix
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/Index.html',
      inject: true,
    }),
    new ExtractTextPlugin({
      filename: getPath => getPath('materialize.scss').replace('scss', 'css'),
      allChunks: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),

    new AppCachePlugin({
      exclude: ['.htaccess'],
    }),
  ],
  module: {
    rules: [
      // Match both .js and .jsx when compiling
      { test: /\.(js|jsx)$/, use: ['react-hot-loader', 'babel-loader'], include: path.join(__dirname, 'client'), exclude: /node_modules|bower_components/ },

      // Extract CSS
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader?importLoaders=1',
        }),
      },

      // Extract SASS/SCSS
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
      },
      //
      {
        // Extract images
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=.+)?$/,
        use: ['file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },

      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
    ],
  },
};

module.exports = config;
