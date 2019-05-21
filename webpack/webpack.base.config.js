var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var context = path.join(__dirname, '/..');
require('babel-plugin-transform-class-properties');

module.exports = {
    context: context,
    entry: './static/app/app.module.ts',
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(context, 'dist'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
        modules: ['node_modules', 'bower_components'],
        descriptionFiles: ['package.json', 'bower.json'],
        alias: {
            '@molior': path.resolve(context, 'static/app/'),
            '@core': path.resolve(context, 'static/app/core/'),
            '@common': path.resolve(context, 'static/app/common/'),
            '@components': path.resolve(context, 'static/app/components/'),
            'style': path.resolve(context, 'static/assets/style'),
            'fonts': path.resolve(context, 'static/assets/fonts'),
            'img': path.resolve(context, 'static/assets/img')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-class-properties', 'transform-async-generator-functions']
                }
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    emitFile: false,
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    emitFile: false,
                },
            },
            {
                exclude: path.join(context, 'static/index.html'),
                test: /\.html$/,
                loader: 'ngtemplate-loader?relativeTo=' + (path.resolve(context, '/static')) + '/!html-loader'
            },
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new CleanWebpackPlugin(['dist/*'], { root: context, watch: true }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
        }),
        new HtmlWebpackPlugin({
            template: 'static/index.html'
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(context, 'static/favicon.ico')
            },
            {
                from: path.resolve(context, 'static/assets'),
                to: 'assets',
                ignore: ['.*']
            }
        ])
    ],
    devtool: 'inline-source-map',
};
