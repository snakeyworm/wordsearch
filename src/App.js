import _regeneratorRuntime from "babel-runtime/regenerator";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var getRandomWords = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return fetch(WORD_REQUEST).then(function (response) {
                            // Continue upon successful request
                            if (response.status === 200) {
                                return response.json();
                            } else {
                                // Handle Wordnik API error
                                throw new Error("Wordnik API error");
                            }
                        }).then(function (data) {
                            // Parse data from response
                            var words = [];
                            data.forEach(function (element) {
                                return words.push(element.word.toLowerCase());
                            });

                            return words;
                        }).then(function (words) {
                            // Filter profanity
                            fetch("http://127.0.0.1:80/?content=" + words.join(",")).then(function (response) {
                                // Continue upon successful request
                                console.log(response);
                                if (response.status === 200) {
                                    return response.json();
                                } else {
                                    // Handle Wordnik API error
                                    throw new Error("Neutrino API error");
                                }
                            }).then(function (data) {
                                // Retry if there is profanity
                                if (data) throw new Error("Profanity error");
                            });
                            return words;
                        }).catch(function () {});

                    case 2:
                        return _context.abrupt("return", _context.sent);

                    case 3:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getRandomWords() {
        return _ref.apply(this, arguments);
    };
}();

// App crontainer


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// wordsearch v0.0.1
// TODO Handle wordnik api error

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Board, { BOARD_WIDTH, BOARD_SIZE } from "./Board";

// Constants

// For gradient

var BG_COLOR = [Math.random() * 255 + 1, Math.random() * 255 + 1, Math.random() * 255 + 1];
// Return random float increment between -1 and 1 
var randomIncrement = function randomIncrement() {
    return [1, -1][Math.floor(Math.random())] * Math.random();
};

// For word generation

var WORD_MIN_LENGTH = 3; // Minmum length of genrate word
var WORD_COUNT = 4; // Number of words to generate
var WORD_REQUEST = "https://api.wordnik.com/v4/words.json/randomWords?limit=" + WORD_COUNT + "&minLength=" + WORD_MIN_LENGTH + "&maxLength=" + BOARD_SIZE + "&includePartOfSpeech=noun,verb,adjective,adverb&api_key=73v51oy38g5q0jwfh5cmgxsmoi8jpu0ma88xyctfhv1iuf559";

var API_TRIS = 50; // Attemtps to use wordnik before API failure is accepted

var styles = {
    container: {
        height: window.innerHeight,
        padding: "10px"
    },
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
    },
    errorContainer: {
        display: "flex",
        backgroundColor: "#121212",
        width: window.innerWidth,
        height: window.innerHeight
    },
    errorText: {
        paddingLeft: "1%",
        fontWeight: "bold",
        backgroundColor: "#121212",
        color: "red",
        fontFamily: "Helvetica"
    }

    // TODO Add profanity filter
};function App() {
    var _this = this;

    var _useState = useState(""),
        _useState2 = _slicedToArray(_useState, 2),
        inputBuf = _useState2[0],
        setInputBuf = _useState2[1];

    var _useState3 = useState(""),
        _useState4 = _slicedToArray(_useState3, 2),
        input = _useState4[0],
        setInput = _useState4[1];

    var _useState5 = useState([]),
        _useState6 = _slicedToArray(_useState5, 2),
        words = _useState6[0],
        setWords = _useState6[1];

    var _useState7 = useState(false),
        _useState8 = _slicedToArray(_useState7, 2),
        error = _useState8[0],
        setError = _useState8[1];

    var container = useRef(null);

    // Handle user input
    var handleChange = function handleChange(event) {
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

    // Get new words
    var newWords = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
            var words, i;
            return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            words = void 0;

                            // Attempt to get words  

                            i = 0;

                        case 2:
                            if (!(i < API_TRIS)) {
                                _context2.next = 12;
                                break;
                            }

                            _context2.next = 5;
                            return getRandomWords();

                        case 5:
                            words = _context2.sent;

                            console.log(words);
                            // Break if API request was successful

                            if (!words) {
                                _context2.next = 9;
                                break;
                            }

                            return _context2.abrupt("break", 12);

                        case 9:
                            i++;
                            _context2.next = 2;
                            break;

                        case 12:
                            if (words) {
                                _context2.next = 15;
                                break;
                            }

                            setError(true);
                            return _context2.abrupt("return");

                        case 15:

                            setWords(words);

                        case 16:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, _this);
        }));

        return function newWords() {
            return _ref2.apply(this, arguments);
        };
    }();

    useEffect(newWords, []);

    useEffect(function () {
        // Background color animation
        setInterval(function () {
            // If there was a game error don't animation background
            if (!container.current) return;

            BG_COLOR[0] += randomIncrement();
            BG_COLOR[1] += randomIncrement();
            BG_COLOR[2] += randomIncrement();

            // Reset if color is out of range
            for (var i = 0; i < BG_COLOR.length; i++) {
                if (BG_COLOR[i] > 255 || BG_COLOR[i] < 0) BG_COLOR[i] = Math.random() * 255 + 1;
            } // Update background
            container.current.style.backgroundColor = "rgb( " + BG_COLOR[0] + ", " + BG_COLOR[1] + ", " + BG_COLOR[2] + " )";
        }, 250);
    }, []);

    // Return error message if there is an error
    if (error) return React.createElement(
        "div",
        { style: styles.errorContainer },
        React.createElement(
            "h1",
            { style: styles.errorText },
            "Error loading game - Please refresh"
        )
    );

    return React.createElement(
        "div",
        { ref: container, style: styles.container },
        React.createElement(
            "div",
            { style: styles.form },
            React.createElement("input", {
                style: styles.inputField,
                type: "text",
                value: inputBuf,
                onChange: handleChange,
                onKeyPress: handleKeyPress })
        ),
        React.createElement(Board, { words: words, newWords: newWords, answer: input })
    );
}

ReactDOM.render(React.createElement(App, null), document.querySelector("#root"));