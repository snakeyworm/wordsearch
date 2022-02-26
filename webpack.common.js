
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const path = require( "path" )

module.exports = {
    resolve: {
        fallback: {
    //         path: require.resolve( "path-browserify" ),
    //         util: require.resolve( "util/" ),
    //         crypto: require.resolve( "crypto-browserify" ),
    //         zlib: require.resolve( "browserify-zlib" ),
    //         stream: require.resolve( "stream-browserify" ),
    //         https: require.resolve( "https-browserify" ),
    //         http: require.resolve( "stream-http" ),
    //         url: require.resolve( "url/" ),
    //         vm: require.resolve( "vm-browserify" ),
    //         querystring: require.resolve( "querystring-es3" ),
    //         os: require.resolve( "os-browserify/browser" ),
            worker_threads: false,
            "uglify-js/package.json": false,
            "@swc/core/package.json": false,
            "esbuild/package.json": false,
            inspector: false,
            assert: false,
            fs: false,
            constants: false,
            child_process: false,
            "uglify-js": false,
            "@swc/core": false,
            esbuild: false,
        }
    },
    plugins: [
        new NodePolyfillPlugin(),
    ],
    entry: "./src/App.js",
    output: {
        path: path.resolve( __dirname, "dist" ),
    },
};
