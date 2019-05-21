const path = require('path');
require('babel-plugin-transform-class-properties');
const webpackConfig = require('./webpack/webpack.test.config');
webpackConfig.entry = '';

module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        reporters: ['mocha'],
        preprocessors: {
            'specs.js': ['webpack', 'sourcemap']
        },
        client: {
            captureConsole: false
        },
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        files: [
            'specs.js'
        ],
        webpack: webpackConfig,

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only'
        },
        webpackServer: {
            noInfo: true // prevent console spamming when running in Karma!
        },
        plugins: [
            'karma-chrome-launcher',
            'karma-ng-html2js-preprocessor',
            'karma-coverage',
            'karma-babel-preprocessor',
            'karma-webpack',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-sourcemap-loader',
            'karma-jasmine',
        ],

        ngHtml2JsPreprocessor: {
            stripPrefix: 'static/',
            moduleName: 'moliorApp.templates'
        },
        colors: true,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        babelPreprocessor: {
            options: {
                presets: ['es2015'],
                plugins: ['transform-class-properties', 'transform-async-generator-functions'],
                sourceMap: 'inline'
            },
            filename: function (file) {
                return file.originalPath.replace(/\.js$/, '.es5.js');
            },
            sourceFileName: function (file) {
                return file.originalPath;
            }
        }
    });
};
