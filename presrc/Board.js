
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

    let [ board, setBoard ] = useState( [] ) // Board data
    let [ boardStyle, setBoardStyle ] = useState( boardStyle );
    let size = 0 // Width and height of board
    
    useEffect( () => {

        // Calculate board size
        props.words.forEach( i => {
            size = i.length > size ? i.length : size
        } )

        // Populate board
        for ( let i=0; i < size; i++ ) {
            for ( let i=0; i < size+1; i++ ) {
                board.push(
                    String.fromCharCode(
                        65 + ( Math.floor( Math.random() * 25 ) )
                    )
                );
            }
            board.push( <br /> ) // Insert break at end of row
        }

        // Resize font
        window.onresize = () => {
            setBoardStyle( {
                ...boardStyle,
                fontSize: window.innerWidth/LETTER_SIZE,
            } )
        }
        
    }, [ props.words ] );

    return ( <div style={boardStyle}>
        {board}
    </div> );

}

export default Board;
