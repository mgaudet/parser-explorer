const path = require('path');
const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// The built site lands in docs/ so it can be served by GitHub Pages straight
// from the branch, with no CI involved.
module.exports = {
  mode: 'production',
  optimization: { minimize: false },
  entry: { main: './web/index.js' },
  output: {
    path: path.resolve(__dirname, 'docs/js'),
    clean: true,
  },
  module: {
    rules: [
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      { test: /\.ttf$/i, use: ['file-loader'] },
      { resourceQuery: /raw/, type: 'asset/source' },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
    new MonacoWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './web/index.html', to: path.resolve(__dirname, 'docs') },
        {
          from: './web/.nojekyll',
          to: path.resolve(__dirname, 'docs'),
          noErrorOnMissing: true,
        },
        {
          from: './js.wasm',
          to: path.resolve(__dirname, 'docs'),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};
