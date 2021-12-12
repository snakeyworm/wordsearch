
// wordsearch v0.0.1

// TODO Revaluate portable layout implementation(Maybe incorporate window.innerHeight)

import React from "react";
import ReactDOM from "react-dom";
import Board from "./Board";
import WordField from "./WordField";

// App container
function App() {

    return React.createElement(
        "div",
        null,
        React.createElement(WordField, null),
        React.createElement(Board, { words: ["ice", "Bible", "God", "computer", "hockey", "chocolate"] })
    );
}

ReactDOM.render(React.createElement(App, null), document.querySelector("#root"));