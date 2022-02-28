
// wordsearch v0.0.1

import React, { useState } from "react"
import ReactDOM from "react-dom"
import { NoEmitOnErrorsPlugin } from "webpack"
import Board from "./Board"

const styles = {
    form: {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        width: window.screen.width * 0.15,
        height: window.innerHeight * 0.03,
        left: "50%",
        transform: "translateX( -50% )",
        top: 4,
    },
    inputField: {
        display: "inline-block",
        padding: "0 30px",
        border: "1px solid black",
        borderRight: "none",
        borderRadius: "5px 0 0 5px",
        fontSze: "120%",
    },
    submitButton: {
        display: "inline-block",
        border: "1px solid black",
        borderLeft: "none",
        borderRadius: "0 5px 5px 0",
        background: "#0000ee",
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
            <input
                style={styles.submitButton}
                type="button"
                value=" hello"
            >
            </input>
        </div>
        {/* <Board words={words} answer={input} /> */}
    </div> )

}

ReactDOM.render( <App />, document.querySelector( "#root" ) )

