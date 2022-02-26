
// wordsearch v0.0.1

import React, { useState } from "react"
import ReactDOM from "react-dom"
import { NoEmitOnErrorsPlugin } from "webpack"
import Board from "./Board"

const styles = {
    form: {
        position: "relative",
        left: "50%",
        top: 4,
    },
    inputField: {
        padding: "0 30px",
        width: window.screen.width * 0.1,
        height: "3%",
        // transform: "translateX( -50% )",
        fontSize: "120%",
        borderRadius:  "5px 5px",
    },
    submitButton: {
        borderRadius: "0 10px 0 10px",
        background: "#0000ee",
        padding: "none",
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

