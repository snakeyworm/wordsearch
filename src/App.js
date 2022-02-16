var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// wordsearch v0.0.1

import React, { useState } from "react";
import ReactDOM from "react-dom";
import Board from "./Board";

var styles = {
    inputField: {
        position: "absolute",
        left: "50%",
        transform: "translate( -50%, -50% )"
    }

    // TODO Add aesthetics
    // App container
};function App() {
    var _useState = useState(""),
        _useState2 = _slicedToArray(_useState, 2),
        input = _useState2[0],
        setInput = _useState2[1];

    var _useState3 = useState(["ice", "bible", "god", "computer", "hockey", "chocolate"]),
        _useState4 = _slicedToArray(_useState3, 2),
        words = _useState4[0],
        setWords = _useState4[1];

    var handleChange = function handleChange(event) {
        setInput(event.target.value);
    };

    return React.createElement(
        "div",
        null,
        React.createElement("input", { style: styles.inputField, type: "text", value: input, onChange: handleChange }),
        React.createElement(Board, { words: words, answer: input })
    );
}

ReactDOM.render(React.createElement(App, null), document.querySelector("#root"));