
// Neutrino Glue

let http = require( "http" )
let url = require( "url" )
let axios = require( "axios" )

const listener = async ( req, res ) => {
    res.setHeader( "Access-Control-Allow-Origin", "*" )
    res.writeHead( 200 )

    // Check user input for profanity
    let neutrinoRes = await axios.post( "https://neutrinoapi.net/bad-word-filter", {
        "user-id": "wormysnake",
        "api-key": "rROFKSQCpD3nWFiKwMBSMhQcfTVruyfLVmUkGN3CZGzhtDGo",
        ip: "35.129.107.98",
        content: new URLSearchParams( req.url ).get( "/?content" )
    }, {
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    } )
    
    // Return error code
    if ( neutrinoRes.status !== 200 )
        res.end( "error" )

    // Return Neutrino Response
    res.end( neutrinoRes.data[ "is-bad" ].toString() )

}

const server = http.createServer( listener )
server.listen( 80 )
