
import React, { useState, useRef, useEffect, } from "react"

// Constants

const BOARD_SIZE = 12
const BOARD_AREA = BOARD_SIZE*BOARD_SIZE
const LETTER_SIZE = 15

const INVALID_WORDS_MSG = "Invalid words provided:"

// Style
const boardStyle = {
    fontSize: window.innerWidth/LETTER_SIZE,
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
    let boardDOM = useRef( null )
    
    let populateBoard = () => {

        // Prop checking

        let requiredArea = 0;

        // Ensure words are correct length
        props.words.forEach( i => { 
            if ( i.length > 12 )
                throw new Error( `${INVALID_WORDS_MSG} word length must be <= 12` )
            requiredArea += i.length
        } )

        // Ensure the board can fit the provided words
        if ( requiredArea > BOARD_AREA )
            throw new Error( `${INVALID_WORDS_MSG} total length of words must be less than ${BOARD_AREA}` )

        // Clear board
        board = []
        
        // Populate board
        for ( let i=0; i < BOARD_SIZE; i++ ) { // Row
            for ( let i=0; i < BOARD_SIZE; i++ ) { // Column
                board.push(
                    String.fromCharCode(
                        65 + ( Math.floor( Math.random() * 25 ) )
                    )
                );
            }
            board.push( <br /> ) // Insert break at end of row
        }

        setBoard( board )
        
    }

    useEffect( () => {

        populateBoard()
        
        // Adjust font on window resize
        window.onresize = () => {
            // TODO Fix this
            console.log( "window resize" )
            console.log( boardDOM.current.style.fontSize )
            boardDOM.current.style.fontSize = window.innerWidth/LETTER_SIZE
        }

    }, [] )

    // Populate board when new words are received
    useEffect( populateBoard, [ props.words ] );

    return ( <div ref={boardDOM} style={boardStyle}>
        {board}
    </div> );

}

export default Board;
