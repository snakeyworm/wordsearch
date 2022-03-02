
// wordsearch v0.0.1

import React, { useState } from "react"
import ReactDOM from "react-dom"
import { NoEmitOnErrorsPlugin } from "webpack"
import Board, { BOARD_WIDTH } from "./Board"

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
        // borderRight: "none",
        borderRadius: "5px",
        fontSize: "180%",
    },
    submitButton: {
        display: "inline-block",
        border: "1px solid black",
        borderLeft: "none",
        borderRadius: "0 5px 5px 0",
        background: "#87cefa",
        cursor: "pointer",
    },
}

// TODO Add aesthetics
// App crontainer
function App() {

    let [ inputBuf, setInputBuf ] = useState( "" )
    let [ input, setInput ] = useState( "" )
    let [ words, setWords ] = useState( [ "ice", "bible", "god", "computer", "hockey", "chocolate" ] )

    // Handle user input
    let handleChange = ( event ) => {
        console.log( event )
        setInputBuf( event.target.value )
    }

    // Handle user return
    let handleKeyPress = ( event ) => {

        if ( event.code === "Enter" ) {
            submit()
        }
        
    }

    // Submit user input
    let submit = () => {
        setInput( inputBuf )
        setInputBuf( "" )

    }

    return ( <div>
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
            {/* <input
                style={styles.submitButton}
                type="button"
            >
            </input> */}
        </div>
        <Board words={words} answer={input} />
    </div> )

}

ReactDOM.render( <App />, document.querySelector( "#root" ) )

