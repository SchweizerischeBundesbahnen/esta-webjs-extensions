module.exports = function (config) {
    var testWebpackConfig = require('./webpack.config.js')({env: 'test'});

    var configuration = {
        basePath: '',
        frameworks: ['jasmine'],
        exclude: [],
        /*
         * we are building the test environment in ./spec-bundle.js
         */
        files: [
            {pattern: './spec-bundle.js', watched: false},
        ],
        /**
         * Preprocess matching files before serving them to the browser
         */
        preprocessors: {'./spec-bundle.js': ['coverage', 'webpack', 'sourcemap']},
        webpackPreprocessor: {
            configPath: './webpack.config.js'
        },
        webpack: testWebpackConfig,
        coverageReporter: {
            type: 'in-memory'
        },
        remapCoverageReporter: {
            'text-summary': null,
            json: './coverage/coverage.json',
            html: './coverage/html'
        },
        webpackMiddleware: {
            // Dont spam the console
            noInfo: true,
            // Turn off verbose output
            stats: {
                 // options i.e.
                chunks: false
            }
        },
         // Test results reporter to use
        reporters: ['mocha', 'coverage', 'remap-coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_WARN,
        autoWatch: false,
        browsers: [
            'Chrome'
        ],
        customLaunchers: {
            ChromeTravisCi: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    };

    if (process.env.TRAVIS) {
        configuration.browsers = [
            'ChromeTravisCi'
        ];
    }
    config.set(configuration);
};