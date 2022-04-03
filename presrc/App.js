
// wordsearch v0.0.1
// TODO Diagonal word red lines don't meet last letter
// TODO Down diagonal word red lines are not accurate
// TODO Reset board when won and alert player of victory
// TODO Handle wordnik api error

import React, { useState,  useRef, useEffect, } from "react"
import ReactDOM from "react-dom"
import { NoEmitOnErrorsPlugin } from "webpack"
import Board, { BOARD_WIDTH, BOARD_SIZE} from "./Board"

// Constants

// For gradient

let BG_COLOR = [ ( Math.random() * 255 ) + 1, ( Math.random() * 255 ) + 1, ( Math.random() * 255 ) + 1 ]
// Return random float increment between -1 and 1 
let randomIncrement = () => [ 1, -1 ][ Math.floor( Math.random() ) ] * Math.random()

// For word generation

const WORD_MIN_LENGTH = 3 // Minmum length of genrate word
const WORD_COUNT = 4 // Number of words to generate
const WORD_REQUEST = `https://api.wordnik.com/v4/words.json/randomWords?limit=${WORD_COUNT}&minLength=${WORD_MIN_LENGTH}&maxLength=${BOARD_SIZE}&includePartOfSpeech=noun,verb,adjective,adverb&api_key=73v51oy38g5q0jwfh5cmgxsmoi8jpu0ma88xyctfhv1iuf559`

const styles = {
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
}

// TODO Make it return random list of words using wordnik
async function getRandomWords() {
    
    // TODO minLength and maxLength are character lengths of word(FIX)
    return await fetch ( WORD_REQUEST ).then( ( response ) => {
        return response.json()
    } ).then( ( data ) => {
        let words = []
        data.forEach( ( element ) => words.push( element.word.toLowerCase() ) )
        return words
    })

}

// App crontainer
function App() {

    let [ inputBuf, setInputBuf ] = useState( "" )
    let [ input, setInput ] = useState( "" )
    let [ words, setWords ] = useState( [] ) 
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
        console.log( "Get new words" )
        setWords( await getRandomWords() )
    }

    useEffect( newWords, [] )

    // TODO Finish linear gradient
    useEffect( () => { 
        // Linear gradient
        setInterval( ()  => {
  
            BG_COLOR[0] += randomIncrement()
            BG_COLOR[1] += randomIncrement()
            BG_COLOR[2] += randomIncrement()

            // Reset if color is out of range
            for ( let i=0; i < BG_COLOR.length; i++ )
                if ( BG_COLOR[i] > 255 || BG_COLOR[i] < 0 )
                    BG_COLOR[i] = Math.random() * 255 + 1


            // Update gradient
            container.current.style.backgroundColor = `rgb( ${BG_COLOR[0]}, ${BG_COLOR[1]}, ${BG_COLOR[2]} )`
                
        }, 250 )

    }, [] )

    return ( <div ref={container} style={{
        height: window.innerHeight,
        padding: "10px",
    }}>
        <div
            style={styles.form}
        >
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

