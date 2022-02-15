var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import React, { useState, useRef, useEffect } from "react";
import { doIntersect, Point } from "./mutils";

// Constants

// TODO Maybe make board bigger
var BOARD_SIZE = 12;
var BOARD_AREA = BOARD_SIZE * BOARD_SIZE;
var FONT_SIZE = window.innerWidth * 0.047; // Size for board font
var COLUMN_SIZE = FONT_SIZE * 0.7; // Size of each column

var INVALID_WORDS_MSG = "Invalid words provided:";

// Enums

var WORD_DIRECTION = {
    HORIZONTAL: 0,
    VERTICAL: 1,
    DIAGONAL_UP: 2,
    DIAGONAL_DOWN: 3

    // Style

};var styles = {
    startBoard: {
        position: "fixed"
    },
    foundWord: {
        textDecoration: "line-through",
        textDecorationColor: "red"
    },
    svg: {
        width: window.innerWidth * 0.431,
        height: COLUMN_SIZE * BOARD_SIZE
    },
    boardText: {
        fontSize: FONT_SIZE,
        writingMode: "tb",
        textOrientation: "upright"
    }

    // Constants(Some constants rely on style declaration)

};var LETTER_WIDTH = styles.svg.width / BOARD_SIZE;
var LETTER_HEIGHT = styles.svg.height / BOARD_SIZE;

// Generate a number between 0 and n-1
var random = function random(n) {
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

    var _useState5 = useState(true),
        _useState6 = _slicedToArray(_useState5, 2),
        renderSwitch = _useState6[0],
        reRender = _useState6[1]; // TODO Remove if not needed


    var wordCoords = useRef([]);

    var _useState7 = useState(styles.startBoard),
        _useState8 = _slicedToArray(_useState7, 2),
        boardStyle = _useState8[0],
        setBoardStyle = _useState8[1];

    var boardDOM = useRef(null);

    var populateBoard = function populateBoard() {

        // Prop checking

        var requiredArea = 0;
        wordCoords.current = []; // Dump old word coordinate

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
        for (var i = 0; i < BOARD_SIZE; i++) {
            // Column

            var column = [];

            for (var _i = 0; _i < BOARD_SIZE; _i++) {
                // Row
                column.push(String.fromCharCode(65 + Math.floor(Math.random() * 25)));
            }

            board.push(column);
        }

        // Insert words
        for (var _i2 = 0; _i2 < props.words.length; _i2++) {
            insertWord(props.words[_i2]);
        }setBoard(board);

        console.log(board); // TODO Remove when done
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
                    for (var _i3 = 0; _i3 < word.length; _i3++) {
                        board[coords1[0].x][coords1[0].y + _i3] = word[Math.abs(_i3 - reverse)];
                    } else if (coords1[0].y < coords1[1].y)
                    // Diagonally down
                    for (var _i4 = 0; _i4 < word.length; _i4++) {
                        board[coords1[0].x + _i4][coords1[0].y + _i4] = word[Math.abs(_i4 - reverse)];
                    } else {
                    // Diagonally up
                    for (var _i5 = 0; _i5 < word.length; _i5++) {
                        board[coords1[0].x + _i5][coords1[0].y - _i5] = word[Math.abs(_i5 - reverse)];
                    }
                }

                console.log(word + " " + coords1[2]); // TODO Remove when done

                break;
            }
        }
    };

    // TODO Fix resizing(Position and size better)
    // TODO Figure out how to do this with a reference 
    var resizeBoard = function resizeBoard() {
        return setBoardStyle(Object.assign({}, styles.startBoard, {
            left: window.innerWidth * 0.5 - boardDOM.current.width.baseVal.value / 2,
            top: window.innerHeight * 0.5 - boardDOM.current.height.baseVal.value / 2
        }));
    };

    useEffect(function () {

        populateBoard();
        resizeBoard(); // Initial resize

        // Adjust font on window resize
        window.onresize = function () {
            resizeBoard();
        };
    }, []);

    // Populate board when new words are received
    useEffect(populateBoard, [props.words]);

    // Resize on board change(For initial render)
    useEffect(resizeBoard, [board]);

    // Check for an answer
    useEffect(function () {
        var answerIndex = props.words.indexOf(props.answer.toLowerCase());
        var newLines = [].concat(_toConsumableArray(lines));

        // Check to see if an answer matches
        if (answerIndex !== -1) {

            var coords = wordCoords.current[answerIndex];
            var start = coords[0];
            var end = coords[1];
            var wordDirection = coords[2];
            var diagonalAdjustment = (BOARD_SIZE - end.y) * 2;

            var x1 = LETTER_WIDTH * start.x;
            var y1 = LETTER_HEIGHT * start.y;
            var x2 = LETTER_WIDTH * end.x;
            var y2 = LETTER_HEIGHT * end.y;

            // TODO Improve precision of line placement and ensure portability
            switch (wordDirection) {
                case WORD_DIRECTION.HORIZONTAL:
                    y1 += LETTER_WIDTH / 2;
                    y2 += LETTER_WIDTH / 2;
                    break;
                case WORD_DIRECTION.VERTICAL:
                    x1 += LETTER_WIDTH / 2;
                    x2 += LETTER_WIDTH / 2;
                    break;
                case WORD_DIRECTION.DIAGONAL_UP:
                    x2 += LETTER_WIDTH;
                    y1 += LETTER_HEIGHT / 2 + diagonalAdjustment;
                    break;
                case WORD_DIRECTION.DIAGONAL_DOWN:
                    x2 += LETTER_WIDTH;
                    y2 += LETTER_HEIGHT / 2 - diagonalAdjustment;
                    break;
            }

            newLines.push(React.createElement("line", {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                style: {
                    stroke: "red",
                    strokeWidth: 4
                }
            }));

            setLines(newLines);
        }
    }, [props.answer]);

    var xCount = 0;

    return React.createElement(
        "svg",
        { style: boardStyle, ref: boardDOM, width: styles.svg.width, height: styles.svg.height },
        React.createElement("rect", { width: styles.svg.width, height: styles.svg.height, rx: 10, fill: "white" }),
        React.createElement(
            "text",
            { style: styles.boardText, x: 0, y: 0 },
            board.map(function (i) {
                return React.createElement(
                    "tspan",
                    {
                        x: styles.svg.width / BOARD_SIZE * ++xCount - styles.svg.width * 0.035,
                        y: 0,
                        textLength: styles.svg.width * 0.9
                    },
                    i
                );
            })
        ),
        lines
    );
}

export default Board;