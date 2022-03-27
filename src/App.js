var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// wordsearch v0.0.1

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { NoEmitOnErrorsPlugin } from "webpack";
import Board, { BOARD_WIDTH, BOARD_SIZE } from "./Board";

// Constants

// For gradient

var GRADIENT_COLORS = ["#0b536f", "#ef9d1f", "#ef1fe0", "#1fef55", "#fb3232", "#32e3fb", "#f9fb32", "#c832fb"];
var GRADIENT_RATE = 1;

// For word generation

var WORD_MIN_LENGTH = 3; // Minmum length of genrate word
var WORD_COUNT = 7; // Number of words to generate
var WORD_REQUEST = "\n    https://api.wordnik.com/v4/words.json/randomWords?\n    limit=" + WORD_COUNT + "\n    &minLength=" + WORD_MIN_LENGTH + "\n    &maxLength=" + BOARD_SIZE + "\n    &includePartOfSpeech=noun, verb, adverb, adjective, noun-plural\n    &api_key=73v51oy38g5q0jwfh5cmgxsmoi8jpu0ma88xyctfhv1iuf559";

var styles = {
    form: {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        width: window.screen.width * BOARD_WIDTH * 0.9,
        height: window.innerHeight * 0.0425,
        left: "50%",
        transform: "translate( -50%, -10% )"
    },
    inputField: {
        display: "inline-block",
        width: "100%",
        padding: "0 5px",
        border: "1px solid black",
        // borderRight: "none", TODO Remove if not needed
        borderRadius: "5px",
        fontSize: "180%"
    }

    // TODO Make it return random list of words using wordnik
};function getRandomWords(length) {

    // TODO minLength and maxLength are character lengths of word(FIX)
    fetch(WORD_REQUEST).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
    });
}

// TODO Add aesthetics
// App crontainer
function App() {
    var _useState = useState(""),
        _useState2 = _slicedToArray(_useState, 2),
        inputBuf = _useState2[0],
        setInputBuf = _useState2[1];

    var _useState3 = useState(""),
        _useState4 = _slicedToArray(_useState3, 2),
        input = _useState4[0],
        setInput = _useState4[1];

    var _useState5 = useState(["ice", "bible", "god", "computer", "hockey", "chocolate", "fart"]),
        _useState6 = _slicedToArray(_useState5, 2),
        words = _useState6[0],
        setWords = _useState6[1];

    var container = useRef(null);

    getRandomWords(0);

    // Handle user input
    var handleChange = function handleChange(event) {
        console.log(event);
        setInputBuf(event.target.value);
    };

    // Handle user return
    var handleKeyPress = function handleKeyPress(event) {

        if (event.code === "Enter") {
            // Submit user input
            setInput(inputBuf);
            setInputBuf("");
        }
    };

    // Linear gradient
    useEffect(function () {

        console.log("re render");
        var gradientPercentage = GRADIENT_RATE;
        var index = 1; // Index of next color
        var leftOrRight = true; // Direction of gradient
        var color1 = GRADIENT_COLORS[index - 1];
        var color2 = GRADIENT_COLORS[index];
        setInterval(function () {
            gradientPercentage += leftOrRight ? GRADIENT_RATE : -GRADIENT_RATE;
            if (gradientPercentage >= 100 || gradientPercentage <= 0) {
                console.log("Color change");
                index = index + 1 < GRADIENT_COLORS.legnth ? index + 1 : index;
                console.log(index);
                console.log(GRADIENT_COLORS.length);
                color1 = GRADIENT_COLORS.slice(index - 1, index)[0];
                color2 = GRADIENT_COLORS.slice(index, index + 1)[0];
                console.log(color1);
                console.log(color2);
                leftOrRight = !leftOrRight;
            }
            container.current.style.backgroundImage = "\n                linear-gradient( to " + (leftOrRight ? "right" : "left") + ",\n                    " + color1 + " 0%,\n                    " + color1 + " " + gradientPercentage + "%,\n                    " + color2 + " 0%\n                )";
            console.log(container.current.style.backgroundImage);
        }, 50);
    }, []);

    return React.createElement(
        "div",
        { ref: container, style: {
                height: window.innerHeight,
                padding: "10px"
            } },
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
                onKeyPress: handleKeyPress })
        ),
        React.createElement(Board, { words: words, answer: input })
    );
}

ReactDOM.render(React.createElement(App, null), document.querySelector("#root"));