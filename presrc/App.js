
// wordsearch v0.0.1

import React, { useState,  useRef, useEffect, } from "react"
import ReactDOM from "react-dom"
import { NoEmitOnErrorsPlugin } from "webpack"
import Board, { BOARD_WIDTH } from "./Board"

const GRADIENT_COLORS = [
    "#0b536f",
    "#ef9d1f",
    "#ef1fe0",
    "#1fef55",
    "#fb3232",
    "#32e3fb",
    "#f9fb32", 
    "#c832fb",
]; 
const GRADIENT_RATE = 1

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

// TODO Add aesthetics
// App crontainer
function App() {

    let [ inputBuf, setInputBuf ] = useState( "" )
    let [ input, setInput ] = useState( "" )
    let [ words, setWords ] = useState( [ "ice", "bible", "god", "computer", "hockey", "chocolate", "fart", ] )
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

    // Linear gradient
    useEffect( () => { 

        console.log( "re render" )
        let gradientPercentage = GRADIENT_RATE
        let index = 1 // Index of next color
        let leftOrRight = true // Direction of gradient
        let color1 = GRADIENT_COLORS[ index - 1 ]
        let color2 = GRADIENT_COLORS[ index ]
        setInterval( ()  => {
            gradientPercentage += ( leftOrRight ) ? GRADIENT_RATE : -GRADIENT_RATE
            if ( gradientPercentage >= 100 || gradientPercentage <= 0 ) {
                index = index + 1 < GRADIENT_COLORS.legnth ? index + 1 : index
                console.log( index )
                console.log( GRADIENT_COLORS.length )
                color1 = GRADIENT_COLORS.slice( index - 1, index )[0]
                color2 = GRADIENT_COLORS.slice( index, index + 1 )[0]
                console.log( color1 )
                console.log( color2 )
                leftOrRight = !leftOrRight
            }
            container.current.style.backgroundImage = `
                linear-gradient( to ${leftOrRight ? "right" : "left"},
                    ${color1} 0%,
                    ${color1} ${gradientPercentage}%,
                    ${color2} 0%
                )`
            console.log( container.current.style.backgroundImage )
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

