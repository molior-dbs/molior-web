var webpackConfig = require('./webpack.base.config');
var merge = require('webpack-merge');

webpackConfig = merge(webpackConfig, {
    watchOptions: {
        poll: 1000,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
        ]
    }
});

module.exports = webpackConfig;