var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import React, { useState, useRef, useEffect } from "react";
import { doIntersect, Point } from "./mutils";

// Constants

// TODO Allow user to input a board size for difficulty
var BOARD_SIZE = 11;
var BOARD_AREA = BOARD_SIZE * BOARD_SIZE;
var BOARD_WIDTH = 0.5;
var BOARD_HEIGHT = 0.9;
var FS_FACTOR = 5; // Used in calculation of responsive font size

var INVALID_WORDS_MSG = "Invalid words provided:";

// Sounds
var WIN_SND = new Audio("./assets/sound/win_sound.mp3");
var WORD_FOUND_SND = new Audio("./assets/sound/word_found.mp3");

// Enums

var WORD_DIRECTION = {
    HORIZONTAL: 0,
    VERTICAL: 1,
    DIAGONAL_UP: 2,
    DIAGONAL_DOWN: 3

    // Style

};var styles = {
    board: {
        position: "fixed",
        left: "50%",
        top: "52%",
        transform: "translate( -50%, -50% )"
    },
    boardRect: {
        width: "100%",
        height: "100%",
        rx: 10,
        fill: "white"
    },
    foundWord: {
        textDecoration: "line-through",
        textDecorationColor: "red"
    },
    boardText: {
        writingMode: "tb",
        textOrientation: "upright"
    },
    wordStroke: {
        stroke: "red",
        strokeWidth: window.innerWidth * 0.005
    }

    // Constants(Some constants rely on style declaration)

    // Generate a number between 0 and n-1
};var random = function random(n) {
    return Math.floor(Math.random() * n);
};

// Component for game board
function Board(props) {

    /*
     * props
     *
     * words - array of words to be hidden in the board
     * 
     */

    var _useState = useState([]),
        _useState2 = _slicedToArray(_useState, 2),
        board = _useState2[0],
        setBoard = _useState2[1]; // Board data


    var _useState3 = useState([]),
        _useState4 = _slicedToArray(_useState3, 2),
        lines = _useState4[0],
        setLines = _useState4[1];

    var answers = useRef(0);

    var _useState5 = useState({
        // Calculate board dimensions
        width: window.screen.width * BOARD_WIDTH,
        height: window.innerHeight * BOARD_HEIGHT
        // Calculate dimensions of letter on board
        // letterWidth: window.screen.width * BOARD_WIDTH / BOARD_SIZE,
        // letterHeight: window.innerHeight * BOARD_HEIGHT / BOARD_SIZE,
    }),
        _useState6 = _slicedToArray(_useState5, 2),
        styleOffset = _useState6[0],
        setStyleOffset = _useState6[1];

    var wordCoords = useRef([]);
    var boardDOM = useRef(null);

    var populateBoard = function populateBoard() {

        // Prop checking

        var requiredArea = 0;
        wordCoords.current = []; // Dump old word coordinate

        // Generate answer sheet
        var answers = "Answers: ";
        for (var i = 0; i < props.words.length; i++) {
            answers += props.words[i] + ",";
        } // Log answer sheet
        console.log(answers);

        // Ensure words are correct length
        props.words.forEach(function (i) {
            if (i.length > BOARD_SIZE || i.length === 1) throw new Error(INVALID_WORDS_MSG + " word length must be <= " + BOARD_SIZE + " and >= 1");
            requiredArea += i.length;
        });

        // Ensure the board can fit the provided words
        if (requiredArea > BOARD_AREA) throw new Error(INVALID_WORDS_MSG + " total length of words must be less than " + BOARD_AREA);

        // Clear board
        board = [];

        // Allocate board space
        for (var _i = 0; _i < BOARD_SIZE; _i++) {
            // Column

            var column = [];

            for (var _i2 = 0; _i2 < BOARD_SIZE; _i2++) {
                // Row
                column.push(String.fromCharCode(65 + Math.floor(Math.random() * 25)));
            }

            board.push(column);
        }

        // Insert words
        for (var _i3 = 0; _i3 < props.words.length; _i3++) {
            insertWord(props.words[_i3]);
        }setBoard(board);
    };

    /*
     *  Returns random coordinates for words on the
     * in the form [ x, y, changeXY, ].
     *
     */
    var generateRandomCoords = function generateRandomCoords(word) {

        var a = random(BOARD_SIZE);
        var b = random(BOARD_SIZE - word.length + 1);
        var start = new Point(0, 0);
        var end = new Point(0, 0);

        // Randomly determine if word is horizontal, vertical, or diagonal
        var wordDirection = random(Object.keys(WORD_DIRECTION).length);

        // Generate coordinates based on direction
        switch (wordDirection) {

            case WORD_DIRECTION.HORIZONTAL:
                start = new Point(b, a);
                end = new Point(b + word.length, a);
                break;
            case WORD_DIRECTION.VERTICAL:
                start = new Point(a, b);
                end = new Point(a, b + word.length);
                break;
            case WORD_DIRECTION.DIAGONAL_UP:
            case WORD_DIRECTION.DIAGONAL_DOWN:

                start = new Point(random(BOARD_SIZE - word.length + 1), random(BOARD_SIZE - word.length + 1));

                // TODO Maybe have wordDirection determine up/down not available space
                if (random(2) && start.y + word.length - 1 - (word.length - 1) >= 0) {
                    // Diagonal down
                    end = new Point(start.x + word.length - 1, start.y + word.length - 1);
                    wordDirection = WORD_DIRECTION.DIAGONAL_DOWN;
                } else {
                    start.y += word.length - 1;
                    // Diagonal up
                    end = new Point(start.x + word.length - 1, start.y - (word.length - 1));
                    wordDirection = WORD_DIRECTION.DIAGONAL_UP;
                }

        }

        return [start, end, wordDirection];
    };

    // Insert given word
    var insertWord = function insertWord(word) {

        word = word.toUpperCase();

        // Find coordinates where word would fit
        while (true) {

            var intersect = false;
            var coords1 = generateRandomCoords(word);
            var reverse = 0;

            // Check for intersections with current wotrds
            for (var j = 0; j < wordCoords.current.length; j++) {
                var coords2 = wordCoords.current[j];

                // Retry if intersection found
                if (doIntersect(coords1[0], coords1[1], coords2[0], coords2[1])) {
                    intersect = true;
                    break;
                }
            }

            // Insert word if space is free
            if (!intersect) {

                wordCoords.current.push(coords1);

                // Reverse 
                if (random(2) && random(2)) reverse = word.length - 1;

                // TODO Maybe make a switch statement
                if (coords1[0].y === coords1[1].y)
                    // Insert word across
                    for (var i = 0; i < word.length; i++) {
                        board[coords1[0].x + i][coords1[0].y] = word[Math.abs(i - reverse)];
                    } else if (coords1[0].x === coords1[1].x)
                    // Insert word down
                    for (var _i4 = 0; _i4 < word.length; _i4++) {
                        board[coords1[0].x][coords1[0].y + _i4] = word[Math.abs(_i4 - reverse)];
                    } else if (coords1[0].y < coords1[1].y)
                    // Diagonally down
                    for (var _i5 = 0; _i5 < word.length; _i5++) {
                        board[coords1[0].x + _i5][coords1[0].y + _i5] = word[Math.abs(_i5 - reverse)];
                    } else {
                    // Diagonally up
                    for (var _i6 = 0; _i6 < word.length; _i6++) {
                        board[coords1[0].x + _i6][coords1[0].y - _i6] = word[Math.abs(_i6 - reverse)];
                    }
                }

                break;
            }
        }
    };

    useEffect(populateBoard, []);

    // Populate board when new words are received
    useEffect(populateBoard, [props.words]);

    // TODO Make sure line placement is responsive
    // Check for an answer
    useEffect(function () {
        var answerIndex = props.words.indexOf(props.answer.toLowerCase());
        var newLines = [].concat(_toConsumableArray(lines));

        // Check to see if an answer matches
        if (answerIndex !== -1) {

            WORD_FOUND_SND.play(); // Play word found sound
            answers.current += 1; // Keep tracker of answers

            var coords = wordCoords.current[answerIndex]; // Get answer coords

            var start = coords[0];
            var end = coords[1];
            var wordDirection = coords[2];

            var xUnit = styleOffset.width / BOARD_SIZE; // X-Unit to move each line by
            // TODO Not accurate with all screen sizes fix soon
            var yUnit = styleOffset.height / (BOARD_SIZE - 0.325); // Y-Unit to move each line by
            var startXOffset = styleOffset.width / BOARD_SIZE / 2; // X-Offset of vertically placed lines
            var startYOffset = styleOffset.height * 0.0325; // Y-Offset of horizontally placed lines

            // Line coordinates
            var x1 = xUnit * start.x;
            var y1 = yUnit * start.y;
            var x2 = xUnit * end.x;
            var y2 = yUnit * end.y;

            // Adjust line placement(Adds a different offset needing to place line based on different line directions)
            switch (wordDirection) {
                case WORD_DIRECTION.HORIZONTAL:
                    y1 += startYOffset;
                    y2 += startYOffset;
                    break;
                case WORD_DIRECTION.VERTICAL:
                    x1 += startXOffset;
                    x2 += startXOffset;
                    break;
                case WORD_DIRECTION.DIAGONAL_UP:
                    x2 += xUnit;
                    y1 += yUnit;
                    y1 -= styleOffset.height * 0.015;
                    y2 -= styleOffset.height * 0.015;
                    break;
                case WORD_DIRECTION.DIAGONAL_DOWN:
                    x2 += xUnit;
                    y2 += yUnit;
                    y1 -= styleOffset.height * 0.015;
                    y2 -= styleOffset.height * 0.015;
                    break;
            }

            newLines.push(React.createElement("line", {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                style: styles.wordStroke
            }));

            setLines(newLines);

            // Victory after five seconds
            setTimeout(function () {
                // Get new words and clear old lines
                if (answers.current === props.words.length) {

                    // Play win sound
                    WIN_SND.play();

                    // Reset board

                    answers.current = 0;
                    props.newWords();
                    setLines([]);
                }
            }, 5000);
        }
    }, [props.answer]);

    window.onresize = function () {
        setStyleOffset({
            // Calculate board dimensions
            width: window.screen.width * BOARD_WIDTH,
            height: window.innerHeight * BOARD_HEIGHT
        });
    };

    var xCount = 0;

    return React.createElement(
        "div",
        null,
        React.createElement(
            "svg",
            { style: styles.board, ref: boardDOM, width: styleOffset.width, height: styleOffset.height },
            React.createElement("rect", { style: styles.boardRect }),
            React.createElement(
                "text",
                {
                    style: styles.boardText,
                    fontSize: styleOffset.width / window.innerWidth * FS_FACTOR + "vw"
                },
                board.map(function (i) {
                    return React.createElement(
                        "tspan",
                        {
                            x: styleOffset.width / BOARD_SIZE / 2 + styleOffset.width / BOARD_SIZE * xCount++,
                            y: 0,
                            textLength: styleOffset.height
                        },
                        i
                    );
                })
            ),
            lines
        )
    );
}

export default Board;
export { BOARD_WIDTH, BOARD_SIZE };