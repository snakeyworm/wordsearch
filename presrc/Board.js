
import React, { useState, useRef, useEffect, } from "react"
import { doIntersect, Point } from "./mutils";

// Constants

const BOARD_SIZE = 12
const BOARD_AREA = BOARD_SIZE * BOARD_SIZE
const FONT_MULTIPLIER = 0.05;

const INVALID_WORDS_MSG = "Invalid words provided:"

// Enums

const WORD_DIRECTION = {
    HORIZONTAL: 0,
    VERTICAL: 1,
    DIAGONAL: 2,
}

// Style
// TODO Fix letter spacing
const startBoardStyle = {
    position: "fixed",
}

// Generate a number between 0 and n-1
let random = ( n ) => Math.floor( Math.random() * n ) 

// Component for game board
function Board( props ) {

    /*
     * props
     *
     * words - array of words to be hidden in the board
     * 
     */

    let [ board, setBoard ] = useState( [] ) // Board data
    let wordCoords = useRef( [] )
    let [ boardStyle, setBoardStyle ] = useState( startBoardStyle )
    let boardDOM = useRef( null )

    let populateBoard = () => {

        // Prop checking

        let requiredArea = 0;

        // Ensure words are correct length
        props.words.forEach( i => {
            if ( i.length > BOARD_SIZE || i.length === 1 )
                throw new Error( `${INVALID_WORDS_MSG} word length must be <= ${BOARD_SIZE} and >= 1` )
            requiredArea += i.length
        } )

        // Ensure the board can fit the provided words
        if ( requiredArea > BOARD_AREA )
            throw new Error( `${INVALID_WORDS_MSG} total length of words must be less than ${BOARD_AREA}` )

        // Clear board
        board = []

        // Allocate board space
        for ( let i = 0; i < BOARD_SIZE; i++ ) { // Row

            let row = []

            for ( let i = 0; i < BOARD_SIZE; i++ ) { // Column
                row.push(
                    String.fromCharCode(
                        65 + ( Math.floor( Math.random() * 25 ) )
                    )
                );
            }

            row.push( <br /> ) // Insert break at end of row
            board.push( row )

        }

        // Insert words
        for ( let i = 0; i < props.words.length; i++ )
            insertWord( props.words[i] )

        setBoard( board )

    }

    /*
     *  Returns random coordinates for words on the
     * in the form [ x, y, changeXY, ].
     *
     */
    let generateRandomCoords = ( word ) => {
        
        let a = random( BOARD_SIZE )
        let b = random( BOARD_SIZE - word.length + 1 )
        let start = new Point( 0, 0 )
        let end = new Point( 0, 0 )

        // Randomly determine if word is horizontal, vertical, or diagonal
        let accrossOrDown = random( Object.keys( WORD_DIRECTION ).length )
    
        // Generate coordinates based on direction
        switch ( accrossOrDown ) {

            case WORD_DIRECTION.HORIZONTAL:
                start = new Point( b, a )
                end = new Point( b + word.length, a )
                break
            case WORD_DIRECTION.VERTICAL:
                start = new Point( a, b )
                end = new Point( a, b + word.length )
                break
            case WORD_DIRECTION.DIAGONAL:

                start = new Point(
                    random( BOARD_SIZE - word.length + 1 ),
                    random( BOARD_SIZE - word.length + 1 )
                )

                if ( random( 2 ) && start.y + word.length - 1 - ( word.length - 1 ) >= 0 ) {
                    // Diagonal down
                    end = new Point( start.x + word.length - 1, start.y + word.length - 1 )
                } else {
                    start.y += word.length - 1
                    // Diagonal up
                    end = new Point( start.x + word.length - 1, start.y - ( word.length - 1 ) )
                }
                    
        }

        return [
            start,
            end,
        ]
    
    }

    // TODO Eventually add diagonal word insertion
    // TODO Eventually add reverse word insertion
    // Insert given word
    let insertWord = ( word ) => {

        word = word.toUpperCase()

        // Find coordinates where word would fit
        while ( true ) {

            let intersect = false
            let coords1 = generateRandomCoords( word )

            // Check for intersections with current wotrds
            for ( let j = 0; j < wordCoords.current.length; j++ ) {
                let coords2 = wordCoords.current[j]

                // Retry if intersection found
                if ( doIntersect( coords1[0], coords1[1], coords2[0], coords2[1] ) ) {
                    intersect = true
                    break
                }
                
            }

            // Insert word if space is free
            if ( !intersect ) {

                wordCoords.current.push( coords1 )

                if ( coords1[0].y === coords1[1].y )
                    // Insert word accross
                    for ( let i = 0; i < word.length; i++ )
                        board[ coords1[0].y ][ coords1[0].x + i ] = word[i]
                else if ( coords1[0].x === coords1[1].x )
                    // Insert word down
                    for ( let i = 0; i < word.length; i++ )
                        board[ coords1[0].y + i ][ coords1[0].x ] = word[i]
                else if ( coords1[0].y < coords1[1].y ) // TODO Test again to see if it works
                    // Diagonally down
                    for ( let i = 0; i < word.length; i++ )
                        board[ coords1[0].y + i ][ coords1[0].x + i ] = word[i]
                else
                    // Diagonally up
                    for ( let i = 0; i < word.length; i++ )
                        board[ coords1[0].y - i ][ coords1[0].x + i ] = word[i]
                }

                break

            }


        }

    }

    // TODO Figure out how to do this with a reference 
    let resizeBoard = () => setBoardStyle( {
        ...startBoardStyle,
        left: window.innerWidth * 0.5 - boardDOM.current.offsetWidth / 2,
        top: window.innerHeight * 0.5 - boardDOM.current.offsetHeight / 2,
        fontSize: window.innerWidth * FONT_MULTIPLIER,
    } )

    useEffect( () => {

        populateBoard()
        resizeBoard() // Initial resize

        // Adjust font on window resize
        window.onresize = () => {
            resizeBoard()
        }

    }, [] )

    // Populate board when new words are received
    useEffect( populateBoard, [ props.words ] )
    useEffect( resizeBoard, [ board ] ) // Resize on board change(For initial render)

    return ( <div ref={boardDOM} style={boardStyle}>
        {board}
    </div> );

}

export default Board;
