
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
    
    // TODO Populate board with words provided not random letters
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
            let row =  Math.floor( Math.random() * 12 )
            let column = Math.floor( Math.random() * 12 - word.length )

            // Insert accross a row or a column
            if ( Math.floor( Math.random() * 2 ) )
                // Row
                for ( let x=0; x < word.length; x++ )
                    board[ row + x ][ column ] = word[x]
            else
                // Column
                for ( let y=0; y < word.length; y++ ) 
                    board[ row ][ column + y ] = word[y]

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
