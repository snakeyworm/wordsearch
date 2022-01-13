var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React, { useState, useRef, useEffect } from "react";
import { doIntersect, Point } from "./mutils";

// Constants

var BOARD_SIZE = 12;
var BOARD_AREA = BOARD_SIZE * BOARD_SIZE;
var FONT_MULTIPLIER = 0.05;

var INVALID_WORDS_MSG = "Invalid words provided:";

// Style
var startBoardStyle = {
    position: "fixed"

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


    var wordCoords = useRef([]);

    var _useState3 = useState(startBoardStyle),
        _useState4 = _slicedToArray(_useState3, 2),
        boardStyle = _useState4[0],
        setBoardStyle = _useState4[1];

    var boardDOM = useRef(null);

    // TODO Fix word insertion
    var populateBoard = function populateBoard() {

        // Prop checking

        var requiredArea = 0;

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
            // Row

            var row = [];

            for (var _i = 0; _i < BOARD_SIZE; _i++) {
                // Column
                row.push(String.fromCharCode(65 + Math.floor(Math.random() * 25)));
            }

            row.push(React.createElement("br", null)); // Insert break at end of row
            board.push(row);
        }

        for (var _i2 = 0; _i2 < props.words.length; _i2++) {
            insertWord(props.words[_i2]);
        }setBoard(board);
    };

    // TODO Eventually generate diagonal coords
    /*
     *  Returns random coordinates for words on the
     * in the form [ x, y, changeXY, ].
     *
     */
    var generateRandomCoords = function generateRandomCoords(word) {

        var accrossOrDown = random(2);
        var a = random(BOARD_SIZE);
        var b = random(BOARD_SIZE - word.length + 1);
        var x = void 0;
        var y = void 0;

        // Set x and y values based on word axis
        if (accrossOrDown) {
            x = b;
            y = a;
        } else {
            x = a;
            y = b;
        }

        return [new Point(x, y), new Point(x + (accrossOrDown ? word.length : 0), y + (!accrossOrDown ? word.length : 0))];
    };

    // Insert given word
    var insertWord = function insertWord(word) {

        word = word.toUpperCase();

        // Find coordinates where word would fit
        while (true) {

            var intersect = false;
            var coords1 = generateRandomCoords(word);

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

                if (coords1[0].x === coords1[1].x)
                    // Insert word accross
                    for (var i = 0; i < word.length; i++) {
                        board[coords1[0].x][coords1[1].y + i] = word[i];
                    } else
                    // Insert word down
                    for (var _i3 = 0; _i3 < word.length; _i3++) {
                        board[coords1[0].x + _i3][coords1[1].y] = word[_i3];
                    }break;
            }
        }
    };

    var insertWords = function insertWords() {

        // Insert each word
        for (var i = 0; i < props.words.length; i++) {

            var word = props.words[i];

            // // Insert accross a row or a column
            // if ( accrossOrDown ) {
            //     row = Math.floor( Math.random() * 12 )
            //     column = Math.floor( Math.random() * ( 12 - word.length + 1 ) )
            //     // Across
            //     for ( let x = 0; x < word.length; x++ ) {
            //         board[ row ][ column + x ] = word[ x ].toUpperCase()
            //     }
            // } else {
            //     row = Math.floor( Math.random() * ( 12 - word.length + 1 ) )
            //     column = Math.floor( Math.random() * 12 )
            //     // Down
            //     for ( let y = 0; y < word.length; y++ ) {
            //         board[ row + y ][ column ] = word[ y ].toUpperCase()
            //     }
            // }
        }
    };

    // TODO Figure out how to do this with a reference 
    var resizeBoard = function resizeBoard() {
        return setBoardStyle(Object.assign({}, startBoardStyle, {
            left: window.innerWidth * 0.5 - boardDOM.current.offsetWidth / 2,
            top: window.innerHeight * 0.5 - boardDOM.current.offsetHeight / 2,
            fontSize: window.innerWidth * FONT_MULTIPLIER
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
    useEffect(resizeBoard, [board]); // Resize on board change(For initial render)

    return React.createElement(
        "div",
        { ref: boardDOM, style: boardStyle },
        board
    );
}

export default Board;