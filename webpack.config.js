
const path = require( "path" )

// TODO Create separate debug/prodouction builds for distribution
module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve( __dirname, "dist" ),
        filename: "bundle.js",
    },
};