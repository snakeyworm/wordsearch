
import React, { useState, useRef, useEffect, } from "react"

// Constants

const BOARD_SIZE = 12
const BOARD_AREA = BOARD_SIZE * BOARD_SIZE
const FONT_MULTIPLIER = 0.05;

const INVALID_WORDS_MSG = "Invalid words provided:"

// Style
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

        insertWords()
        setBoard( board )

    }

    /*
     *  Returns random coordinates for words on the
     * in the form [ x, y, changeXY, ].
     *
     */
    let generateRandomCoords = ( word ) => {

        let coords
        let accrossOrDown = random( 2 )
        
        if ( accrossOrDown )
            // Accross
            coords = [ 
                random( BOARD_SIZE ),
                random( BOARD_SIZE - word.length + 1 ),
                word.length * ( accrossOrDown ) ? 1 : -1
            ]
        else
            // Down
            coords = [ 
                random( BOARD_SIZE - word.length + 1 ),
                random( BOARD_SIZE ),
                word.length * ( accrossOrDown ) ? 1 : -1
            ]

        // console.log( coords ) // TODO Random seems to be returning NaN
        return coords

    }

    let insertWords = () => {

        // TODO Remove when done
        wordCoords.current = [
            [ 2, 5, 5 ],
        ]

        // Insert each word
        for ( let i = 0; i < props.words.length; i++ ) {

            let word = props.words[ i ]
            let coords1 = generateRandomCoords( word )
            let accrossOrDown = coords1[2] > 0 ? 0 : 1

            // TODO Remove when done
            coords1 = [ 5, 5, 3 ]
            accrossOrDown = 0
            // TODO Test to see if this works
            for ( let j = 0; j < wordCoords.current.length; j++ ) {
                let coords2 = wordCoords.current[j]
                if (
                    coords1[accrossOrDown] >= coords2[accrossOrDown] && coords1[accrossOrDown] + Math.abs( coords1[2] ) <= coords2[accrossOrDown] + Math.abs( coords2[2] )
                    && coords1[ accrossOrDown === 0 ? 1 : 0 ] === coords2[ accrossOrDown === 0 ? 1 : 0 ] 
                ) {
                    console.log( "Intersects" )
                } else {
                    console.log( "clear" )
                }
            }

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
