
// wordsearch v0.0.1

import React, { useState } from "react"
import ReactDOM from "react-dom"
import Board from "./Board"

// TODO Add aesthetics
// App container
function App() {

    let [ input, setInput ] = useState( "" )
    let [ words, setWords ] = useState( [ "ice", "bible", "god", "computer", "hockey", "chocolate" ] )

    let handleChange = ( event ) => {
        setInput( event.target.value )
    }

    return ( <div>
        <input type="text" value={input} onChange={handleChange}></input>
        <Board words={words} answer={input} />
    </div> )

}

ReactDOM.render( <App />, document.querySelector( "#root" ) )

