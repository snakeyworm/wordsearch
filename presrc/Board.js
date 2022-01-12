
import React, { useState, useEffect, } from "react"

// Constants

const BOARD_SIZE = 12
const BOARD_AREA = BOARD_SIZE*BOARD_SIZE
const FONT_MULTIPLIER = 0.05;

const INVALID_WORDS_MSG = "Invalid words provided:"

// Style
// TODO Fix board positioning
const startBoardStyle = {
    position: "fixed",
    left: window.innerWidth * 0.5,
    top: window.innerWidth * 0.5,
    fontSize: window.innerWidth * FONT_MULTIPLIER,
}

// Component for game board
function Board( props ) {

    /*
     * props
     *
     * words - array of words to be hidden in the board
     * 
     */

    let [ board, setBoard ] = useState( [] ) // Board data
    let [ boardStyle, setBoardStyle ] = useState( startBoardStyle )
    
    // TODO Ensure words do not overwrite each other
    let populateBoard = () => {

        // Prop checking

        let requiredArea = 0;

        // Ensure words are correct length
        props.words.forEach( i => { 
            if ( i.length > BOARD_SIZE )
                throw new Error( `${INVALID_WORDS_MSG} word length must be <= ${BOARD_SIZE}` )
            requiredArea += i.length
        } )

        // Ensure the board can fit the provided words
        if ( requiredArea > BOARD_AREA )
            throw new Error( `${INVALID_WORDS_MSG} total length of words must be less than ${BOARD_AREA}` )

        // Clear board
        board = []
        
        // Populate board
        for ( let i=0; i < BOARD_SIZE; i++ ) { // Row
            let row = []
            for ( let i=0; i < BOARD_SIZE; i++ ) { // Column
                row.push(
                    String.fromCharCode(
                        65 + ( Math.floor( Math.random() * 25 ) )
                    )
                );
            }
            row.push( <br /> ) // Insert break at end of row
            board.push( row )
        }

        // Insert each word
        for ( let i=0; i < props.words.length; i++ ) {
            
            let word = props.words[i]
            let accrossOrDown = Math.floor( Math.random() * 2 ) // Wether word is horizontal or vertical
            let row
            let column

            // Insert accross a row or a column
            if ( accrossOrDown ) {
                row = Math.floor( Math.random() * 12 )
                column = Math.floor( Math.random() * ( 12 - word.length + 1 ) )
                // Across
                for ( let x=0; x < word.length; x++ ) {
                    board[ row ][ column + x ] = word[x].toUpperCase()
                }
            } else {
                row = Math.floor( Math.random() * ( 12 - word.length + 1 ) )
                column = Math.floor( Math.random() * 12 )
                // Down
                for ( let y=0; y < word.length; y++ ) {
                    board[ row + y ][ column ] = word[y].toUpperCase()
                }
            }

        }

        setBoard( board )
        
    }

    useEffect( () => {

        populateBoard()

        // Adjust font on window resize
        window.onresize = () => {
            // TODO Figure out how to do this with a reference 
            setBoardStyle( {
                ...startBoardStyle,
                left: window.innerWidth * 0.5,
                top: window.innerWidth * 0.5,
                fontSize: window.innerWidth * FONT_MULTIPLIER,
            } )
        }

    }, [] )

    // Populate board when new words are received
    useEffect( populateBoard, [ props.words ] );

    return ( <div style={boardStyle}>
        {board}
    </div> );

}

export default Board;
