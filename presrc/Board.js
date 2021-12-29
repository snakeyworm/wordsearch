
import React, { useState, useRef, useEffect, } from "react"

const LETTER_SIZE = 15

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

    let [ board, setBoard ] = useState( [] ) // Board data TODO This should not be a state
    let boardDOM = useRef( null )
    let size = 0 // Width and height of board
    
    let populateBoard = () => {

        board = []

        // Calculate board size
        props.words.forEach( i => {
            size = i.length > size ? i.length : size
        } )
    
        // Populate board
        for ( let i=0; i < size; i++ ) { // Row
            for ( let i=0; i < size+1; i++ ) { // Column
                board.push(
                    String.fromCharCode(
                        65 + ( Math.floor( Math.random() * 25 ) )
                    )
                );
            }
            board.push( <br /> ) // Insert break at end of row
        }

        console.log( board )
        setBoard( board )
        
    }

    useEffect( () => {

        populateBoard()
        
        // Adjust font on window resize
        window.onresize = () => {
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
