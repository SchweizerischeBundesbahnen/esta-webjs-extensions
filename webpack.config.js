const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const root = path.join.bind(path, ROOT);

const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

module.exports = function () {
    return {
        // Source map for Karma from the help of karma-sourcemap-loader &  karma-webpack
        devtool: 'inline-source-map',

        /**
         * Options affecting the resolving of modules.
         * See: http://webpack.github.io/docs/configuration.html#resolve
         */
        resolve: {

            /**
             * An array of extensions that should be used to resolve modules.
             * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
             */
            extensions: ['.ts', '.js'],
            // Make sure root is src
            modules: [root('src'), 'node_modules']
        },

        /**
         * Options affecting the normal modules.
         * See: http://webpack.github.io/docs/configuration.html#module
         */
        module: {

            rules: [

                /**
                 * Source map loader support for *.js files
                 * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
                 */
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: 'source-map-loader',
                    exclude: [
                        //These packages have problems with their sourcemaps
                        root('node_modules/rxjs'),
                        root('node_modules/@angular')
                    ]
                },

                /**
                 * Typescript loader support for .ts and Angular 2 async routes via .async.ts
                 * See: https://github.com/s-panferov/awesome-typescript-loader
                 */
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'awesome-typescript-loader',
                            query: {
                                /**
                                 * Use inline sourcemaps for "karma-remap-coverage" reporter
                                 */
                                sourceMap: false,
                                inlineSourceMap: true,
                                compilerOptions: {
                                    /**
                                     * Remove TypeScript to be injected
                                     * below by DefinePlugin
                                     */
                                    removeComments: true
                                }
                            },
                        },
                        'angular2-template-loader'
                    ],
                    exclude: [/\.e2e\.ts$/]
                },

                /**
                 * Json loader support for *.json files.
                 *
                 * See: https://github.com/webpack/json-loader
                 */
                {
                    test: /\.json$/,
                    loader: 'json-loader',
                    exclude: [root('src/index.html')]
                },

                /**
                 * Raw loader support for *.css files
                 * Returns file content as string
                 *
                 * See: https://github.com/webpack/raw-loader
                 */
                {
                    test: /\.css$/,
                    loader: ['to-string-loader', 'css-loader'],
                    exclude: [root('src/index.html')]
                },

                /**
                 * Raw loader support for *.scss files
                 *
                 * See: https://github.com/webpack/raw-loader
                 */
                {
                    test: /\.scss$/,
                    loader: ['raw-loader', 'sass-loader'],
                    exclude: [root('src/index.html')]
                },

                /**
                 * Raw loader support for *.html
                 * Returns file content as string
                 *
                 * See: https://github.com/webpack/raw-loader
                 */
                {
                    test: /\.html$/,
                    loader: 'raw-loader',
                    exclude: [root('src/index.html')]
                },

                /**
                 * Instruments JS files with Istanbul for subsequent code coverage reporting.
                 * Instrument only testing sources.
                 *
                 * See: https://github.com/deepsweet/istanbul-instrumenter-loader
                 */
                {
                    enforce: 'post',
                    test: /\.(js|ts)$/,
                    loader: 'istanbul-instrumenter-loader',
                    include: root('src'),
                    exclude: [
                        /\.(e2e|spec)\.ts$/,
                        /node_modules/
                    ]
                }

            ]
        },

        /**
         * Add additional plugins to the compiler.
         * See: http://webpack.github.io/docs/configuration.html#plugins
         */
        plugins: [

            /**
             * Plugin: ContextReplacementPlugin
             * Description: Provides context to Angular's use of System.import
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
             * See: https://github.com/angular/angular/issues/11580
             */
            new ContextReplacementPlugin(
                /**
                 * The (\\|\/) piece accounts for path separators in *nix and Windows
                 */
                /angular(\\|\/)core(\\|\/)@angular/,
                root('src'), // location of your src
                {
                    /**
                     * your Angular Async Route paths relative to this root directory
                     */
                }
            ),
        ],
        /**
         * Include polyfills or mocks for various node stuff
         * Description: Node configuration
         *
         * See: https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            global: true,
            process: false,
            crypto: 'empty',
            module: false,
            clearImmediate: false,
            setImmediate: false
        }

    };
}