
const path = require( "path" )

module.exports = {
    entry: "./src/App.js",
    output: {
        path: path.resolve( __dirname, "dist" ),
    },
};
