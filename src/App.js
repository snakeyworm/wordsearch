var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// wordsearch v0.0.1

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { NoEmitOnErrorsPlugin } from "webpack";
import Board from "./Board";

var styles = {
    form: {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        width: window.screen.width * 0.15,
        height: window.innerHeight * 0.03,
        left: "50%",
        transform: "translateX( -50% )",
        top: 4
    },
    inputField: {
        display: "inline-block",
        padding: "0 30px",
        border: "1px solid black",
        borderRight: "none",
        borderRadius: "5px 0 0 5px",
        fontSze: "120%"
    },
    submitButton: {
        display: "inline-block",
        border: "1px solid black",
        borderLeft: "none",
        borderRadius: "0 5px 5px 0",
        background: "#0000ee",
        cursor: "pointer"
    }

    // TODO Add aesthetics
    // App crontainer
};function App() {
    var _useState = useState(""),
        _useState2 = _slicedToArray(_useState, 2),
        inputBuf = _useState2[0],
        setInputBuf = _useState2[1];

    var _useState3 = useState(""),
        _useState4 = _slicedToArray(_useState3, 2),
        input = _useState4[0],
        setInput = _useState4[1];

    var _useState5 = useState(["ice", "bible", "god", "computer", "hockey", "chocolate"]),
        _useState6 = _slicedToArray(_useState5, 2),
        words = _useState6[0],
        setWords = _useState6[1];

    // Handle user input


    var handleChange = function handleChange(event) {
        console.log(event);
        setInputBuf(event.target.value);
    };

    // Handle user return
    var handleKeyPress = function handleKeyPress(event) {

        if (event.code === "Enter") {
            submit();
        }
    };

    // Submit user input
    var submit = function submit() {
        setInput(inputBuf);
        setInputBuf("");
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            {
                style: styles.form
            },
            React.createElement("input", {
                style: styles.inputField,
                type: "text",
                value: inputBuf,
                onChange: handleChange,
                onKeyPress: handleKeyPress }),
            React.createElement("input", {
                style: styles.submitButton,
                type: "button",
                value: " hello"
            })
        )
    );
}

ReactDOM.render(React.createElement(App, null), document.querySelector("#root"));