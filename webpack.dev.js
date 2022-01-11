
const { merge } = require( "webpack-merge" )
const common = require( "./webpack.common.js" )

// TODO Add sources maps to prod.js also

module.exports = merge( common, {
    mode: "development",
    devtool: "inline-source-map",
    output: {
        filename: "bundle-dev.js",
    },
} )
