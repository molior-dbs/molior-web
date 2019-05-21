var webpackConfig = require('./webpack.base.config');

Object.assign(webpackConfig, {
    entry: './specs.js',
    devtool: 'cheap-module-inline-source-map',
    plugins: []
});

webpackConfig.module.rules.push(
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
    }
);

webpackConfig.module.rules.push(
    {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
    }
);

module.exports = webpackConfig;