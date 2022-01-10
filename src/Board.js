var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React, { useState, useRef, useEffect } from "react";

// Constants

var BOARD_SIZE = 12;
var BOARD_AREA = BOARD_SIZE * BOARD_SIZE;
var LETTER_SIZE = 15;

var INVALID_WORDS_MSG = "Invalid words provided:";

// Style
var boardStyle = {
    fontSize: window.innerWidth / LETTER_SIZE

    // Component for game board
};function Board(props) {

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


    var boardDOM = useRef(null);

    // TODO Populate board with words provided not random letters
    var populateBoard = function populateBoard() {

        // Prop checking

        var requiredArea = 0;

        // Ensure words are correct length
        props.words.forEach(function (i) {
            if (i.length > BOARD_SIZE) throw new Error(INVALID_WORDS_MSG + " word length must be <= " + BOARD_SIZE);
            requiredArea += i.length;
        });

        // Ensure the board can fit the provided words
        if (requiredArea > BOARD_AREA) throw new Error(INVALID_WORDS_MSG + " total length of words must be less than " + BOARD_AREA);

        // Clear board
        board = [];

        // Populate board
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

        // Insert each word
        for (var _i2 = 0; _i2 < props.words.length; _i2++) {

            var word = props.words[_i2];
            var _row = Math.floor(Math.random() * 12);
            var column = Math.floor(Math.random() * 12 - word.length);

            // Insert accross a row or a column
            if (Math.floor(Math.random() * 2))
                // Row
                for (var x = 0; x < word.length; x++) {
                    board[_row + x][column] = word[x];
                } else
                // Column
                for (var y = 0; y < word.length; y++) {
                    board[_row][column + y] = word[y];
                }
        }

        setBoard(board);
    };

    useEffect(function () {

        populateBoard();

        // Adjust font on window resize
        window.onresize = function () {
            // TODO Fix this
            console.log("window resize");
            console.log(boardDOM.current.style.fontSize);
            boardDOM.current.style.fontSize = window.innerWidth / LETTER_SIZE;
        };
    }, []);

    // Populate board when new words are received
    useEffect(populateBoard, [props.words]);

    return React.createElement(
        "div",
        { ref: boardDOM, style: boardStyle },
        board
    );
}

export default Board;