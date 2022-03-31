
// wordsearch v0.0.1

import React, { useState,  useRef, useEffect, } from "react"
import ReactDOM from "react-dom"
import { NoEmitOnErrorsPlugin } from "webpack"
import Board, { BOARD_WIDTH, BOARD_SIZE} from "./Board"

// Constants

// For gradient

let GRADIENT_COLOR = 255
const GRADIENT_RATE = 1

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
        data.forEach( ( element ) => words.push( element.word ) )
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

    useEffect( async () => {
        setWords( await getRandomWords() )
    }, [] )

    // TODO Finish linear gradient
    useEffect( () => { 

        // Linear gradient

        let gradientPercentage = GRADIENT_RATE
        let leftOrRight = true // Direction of gradient
        let blue = GRADIENT_COLOR
        setInterval( ()  => {
            gradientPercentage += ( leftOrRight ) ? GRADIENT_RATE : -GRADIENT_RATE
            
            // Switch direction and colors
            if ( gradientPercentage >= 100 || gradientPercentage <= 0 ) {
                leftOrRight = !leftOrRight
                blue -= 12.75
                if ( blue === 0 )
                    blue = 255
            }
            // Update gradient
            container.current.style.backgroundImage = `
                linear-gradient( to right,
                    rgb( 0, 0, ${blue} ) 0%,
                    rgb( 0, 0, ${blue} ) ${gradientPercentage}%,
                    #000000 0%
                )`
        }, 50 )

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
        <Board words={words} answer={input} />
    </div> )

}

ReactDOM.render( <App />, document.querySelector( "#root" ) )

