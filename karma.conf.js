// module.exports = function (config) {
//   config.set({
//     // base path that will be used to resolve all patterns (eg. files, exclude)
//     basePath: '',
//     frameworks: ['mocha', 'sinon'],
//         files: [
//           'http://polyfill.webservices.ft.com/v1/polyfill.js?flags=gated',
//           'http://wzrd.in/standalone/uuid%2Fv4@latest',
//           'public/lib/js.cookie.js',
//           'tests/browser/*.spec.js'
//           ],
//     // preprocess matching files before serving them to the browser
//     // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
//     preprocessors: {
//       '**/*.spec.js': ['webpack']
//     },
//     reporters: ['spec'],
//     port: 9876, // karma web server port
//     colors: true,
//     logLevel: config.LOG_INFO,
//     autoWatch: false,
//     browsers: ['Chrome'],
//     singleRun: true,
//     concurrency: Infinity
//   });
// };
module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    frameworks: ['mocha', 'sinon'],
    files: [
      'http://polyfill.webservices.ft.com/v1/polyfill.js?flags=gated',
      'http://wzrd.in/standalone/uuid%2Fv4@latest',
      'public/lib/js.cookie.js',
      'tests/browser/*.spec.js'
      ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    plugins: [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-sinon',
      'karma-webpack'
    ],
    preprocessors: {
      'tests/browser/*.spec.js': ['webpack']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type : 'text-summary'
    },
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    // browsers: ['ChromeHeadless'],
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity,
    webpack: {
      quiet: true,
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: []
          },
          {
            test: /\.json$/,
            loader: 'json'
          }
        ],
        postLoaders: [
          { //delays coverage til after tests are run, fixing transpiled source coverage error
            test: /\.js$/,
            exclude: /(test|node_modules|bower_components)\//,
            loader: 'istanbul-instrumenter'
          }
        ],
        noParse: [
          /\/sinon\.js/,
        ]
      },
    },

    // Hide webpack output logging
    webpackMiddleware: {
      noInfo: true
    }
  });
};
