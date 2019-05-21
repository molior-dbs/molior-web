var webpackConfig = require('./webpack.base.config');
var merge = require('webpack-merge');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

webpackConfig = merge(webpackConfig, {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            sourceMap: true,
        }),
        new ExtractTextPlugin('[name].css'),

    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                })
            },
        ]
    },
});

module.exports = webpackConfig;