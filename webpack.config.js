const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = (env) => {
    return {
        mode: 'development',
        entry: [
            './app/resources/js/app.js',
            './app/resources/css/app.css'
        ],
        optimization: {
            minimize: env.prod,
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin({
                    extractComments: false,
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                }),
            ],
        },
        output: {
            path: path.resolve(__dirname, './public/assets/'),
            filename: 'app.js'
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
                }
            ]
        },
        plugins: [new MiniCssExtractPlugin({
            filename: 'app.css'
        })]
    }
}
