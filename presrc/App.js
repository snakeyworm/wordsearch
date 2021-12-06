
// wordsearch v0.0.1

import Board from "./Board";
import WordField from "./WordField";

// App container
function App() {

    return ( <div>
        <WordField />
        <Board />
    </div> );

}

ReactDOM.render( <App />, document.querySelector( "#root" ) )

