const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'development',
    entry: [
        './app/resources/js/app.js',
        './app/resources/css/app.css'
    ],
    output: {
        path: path.resolve(__dirname, './public/assets/'),
        filename: 'app.js',
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
      ],
    },
    plugins: [new MiniCssExtractPlugin({
        filename:"app.css",
    })]
};