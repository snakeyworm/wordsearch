
// wordsearch v0.0.1

import React from "react"
import ReactDOM from "react-dom"
import Board from "./Board"
import WordField from "./WordField"

// App container
function App() {

    return ( <div>
        <WordField />
        <Board words={[ "ice", "Bible", "God", "computer", "hockey", "chocolate" ]} />
    </div> )

}

ReactDOM.render( <App />, document.querySelector( "#root" ) )

