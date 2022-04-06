
// wordsearch v0.0.1
// TODO Handle wordnik api error

import React, { useState, useRef, useEffect, } from "react"
import ReactDOM from "react-dom"
import Board, { BOARD_WIDTH, BOARD_SIZE } from "./Board"

// Constants

// For gradient

let BG_COLOR = [ ( Math.random() * 255 ) + 1, ( Math.random() * 255 ) + 1, ( Math.random() * 255 ) + 1 ]
// Return random float increment between -1 and 1 
let randomIncrement = () => [ 1, -1 ][ Math.floor( Math.random() ) ] * Math.random()

// For word generation

const WORD_MIN_LENGTH = 3 // Minmum length of genrate word
const WORD_COUNT = 4 // Number of words to generate
const WORD_REQUEST = `https://api.wordnik.com/v4/words.json/randomWords?limit=${WORD_COUNT}&minLength=${WORD_MIN_LENGTH}&maxLength=${BOARD_SIZE}&includePartOfSpeech=noun,verb,adjective,adverb&api_key=73v51oy38g5q0jwfh5cmgxsmoi8jpu0ma88xyctfhv1iuf559`

const API_TRIS = 50; // Attemtps to use wordnik before API failure is accepted

const styles = {
    container: {
        height: window.innerHeight,
        padding: "10px",
    },
    form: {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        width: window.screen.width * BOARD_WIDTH * 0.9,
        height: window.innerHeight * 0.0425,
        left: "50%",
        transform: "translate( -50%, -10% )",
    },
    inputField: {
        display: "inline-block",
        width: "100%",
        padding: "0 5px",
        border: "1px solid black",
        // borderRight: "none", TODO Remove if not needed
        borderRadius: "5px",
        fontSize: "180%",
    },
    errorContainer: {
        display: "flex",
        backgroundColor: "#121212",
        width: window.innerWidth,
        height: window.innerHeight,
    },
    errorText: {
        paddingLeft: "1%",
        fontWeight: "bold",
        backgroundColor: "#121212",
        color: "red",
        fontFamily: "Helvetica",
    },
}

// TODO Add profanity filter
async function getRandomWords() {

    return await fetch( WORD_REQUEST )
        .then( ( response ) => { // Continue upon successful request
            if ( response.status === 200 ) {
                return response.json()
            } else {
                // Handle Wordnik API error
                throw new Error( "Wordnik API error" )
            }
        } )
        .then( ( data ) => {
            // Parse data from response
            let words = []
            data.forEach( ( element ) => words.push( element.word.toLowerCase() ) )

            return words
        } ).then( ( words ) => { // Filter profanity
            fetch( "https://neutrinoapi.net/bad-word-filter", {
                method: "POST",
                body: JSON.stringify( {
                    "user-id": "wormysnake",
                    "api-key": "Lv7LEW5dnatOewWbddZtnns4phzo0OtFyREzW3QrrchjbvyN",
                    ip: "35.129.107.98",
                    content: words.join( "," ),
                } ),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                mode: "no-cors"
            } ).then( ( response ) => { // Continue upon successful request
                console.log( response )
                if ( response.status === 200 ) {
                    return response.json()
                } else {
                    // Handle Wordnik API error
                    throw new Error( "Neutrino API error" )
                }
            } ).then( ( data ) => {
                console.log( data )
                // Retry if there is profanity
                if ( data[ "is-bad" ] )
                    throw new Error( "Profanity error" )
            } )
            return words
        } )
        .catch( () => { } )

}

// App crontainer
function App() {

    let [ inputBuf, setInputBuf ] = useState( "" )
    let [ input, setInput ] = useState( "" )
    let [ words, setWords ] = useState( [] )
    let [ error, setError ] = useState( false )
    let container = useRef( null )

    // Handle user input
    let handleChange = ( event ) => {
        setInputBuf( event.target.value )
    }

    // Handle user return
    let handleKeyPress = ( event ) => {

        if ( event.code === "Enter" ) {
            // Submit user input
            setInput( inputBuf )
            setInputBuf( "" )
        }

    }

    // Get new words
    let newWords = async () => {
        let words

        // Attempt to get words  
        for ( let i = 0; i < API_TRIS; i++ ) {
            words = await getRandomWords()
            console.log( words )
            // Break if API request was successful
            if ( words )
                break
        }

        // Error if words are not found
        if ( !words ) {
            setError( true )
            return
        }

        setWords( words )

    }

    useEffect( newWords, [] )

    useEffect( () => {
        // Background color animation
        setInterval( () => {
            // If there was a game error don't animation background
            if ( !container.current )
                return

            BG_COLOR[ 0 ] += randomIncrement()
            BG_COLOR[ 1 ] += randomIncrement()
            BG_COLOR[ 2 ] += randomIncrement()

            // Reset if color is out of range
            for ( let i = 0; i < BG_COLOR.length; i++ )
                if ( BG_COLOR[ i ] > 255 || BG_COLOR[ i ] < 0 )
                    BG_COLOR[ i ] = Math.random() * 255 + 1

            // Update background
            container.current.style.backgroundColor = `rgb( ${BG_COLOR[ 0 ]}, ${BG_COLOR[ 1 ]}, ${BG_COLOR[ 2 ]} )`

        }, 250 )

    }, [] )

    // Return error message if there is an error
    if ( error )
        return (
            <div style={styles.errorContainer}>
                <h1 style={styles.errorText}>
                    Error loading game - Please refresh
                </h1>
            </div>
        )

    return ( <div ref={container} style={styles.container}>
        <div style={styles.form}>
            <input
                style={styles.inputField}
                type="text"
                value={inputBuf}
                onChange={handleChange}
                onKeyPress={handleKeyPress}>
            </input>
        </div>
        <Board words={words} newWords={newWords} answer={input} />
    </div> )

}

ReactDOM.render( <App />, document.querySelector( "#root" ) )

