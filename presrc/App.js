
// wordsearch v0.0.1

import React, { useState } from "react"
import ReactDOM from "react-dom"
import Board from "./Board"

// App container
function App() {

    let [ input, setInput ] = useState( "" )
    let [ words, setWords ] = useState( [ "ice", "Bible", "God", "computer", "hockey", "chocolate" ] )

    let handleChange = ( event ) => {
        console.log( event.target.value )
        setInput( event.target.value )
    }

    return ( <div>
        <input type="text" value={input} onChange={handleChange}></input>
        <Board words={words} answer={input} />
    </div> )

}

ReactDOM.render( <App />, document.querySelector( "#root" ) )

