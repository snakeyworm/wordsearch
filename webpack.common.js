
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const path = require( "path" )

module.exports = {
    resolve: {
        fallback: {
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
