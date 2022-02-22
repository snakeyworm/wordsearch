
import React, { useState, useRef, useEffect, } from "react"
import { render } from "react-dom";
import { doIntersect, Point } from "./mutils";

// Constants

// TODO Maybe make board bigger
const BOARD_SIZE = 11
const BOARD_AREA = BOARD_SIZE * BOARD_SIZE
const BOARD_WIDTH = 0.5
const BOARD_HEIGHT = 0.9
const FS_FACTOR = 5 // Used in calculation of responsive font size

const INVALID_WORDS_MSG = "Invalid words provided:"

// Enums

const WORD_DIRECTION = {
    HORIZONTAL: 0,
    VERTICAL: 1,
    DIAGONAL_UP: 2,
    DIAGONAL_DOWN: 3,
}

// Style

const styles = {
    board: {
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate( -50%, -50% )",
    },
    boardRect: {
        width: "100%",
        height: "100%",
        rx: 10,
        fill: "white",
    },
    foundWord: {
        textDecoration: "line-through",
        textDecorationColor: "red",
    },
    boardText: {
        writingMode: "tb",
        textOrientation: "upright",
    },
    wordStroke: {
        stroke: "red",
        strokeWidth: window.innerWidth * 0.005,
    }
}

// Constants(Some constants rely on style declaration)

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
    let [ lines, setLines ] = useState( [] )

    let [ styleOffset, setStyleOffset ] = useState( {
        // Calculate board dimensions
        width: window.screen.width * BOARD_WIDTH,
        height: window.innerHeight * BOARD_HEIGHT,
        // Calculate dimensions of letter on board
        letterWidth: window.screen.wdith * BOARD_WIDTH / BOARD_SIZE,
        letterHeight: window.innerHeight * BOARD_HEIGHT / BOARD_SIZE, 
    } )
    let wordCoords = useRef( [] )
    let boardDOM = useRef( null )

    let populateBoard = () => {

        // Prop checking

        let requiredArea = 0;
        wordCoords.current = [] // Dump old word coordinate

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
        for ( let i = 0; i < BOARD_SIZE; i++ ) { // Column

            let column = []

            for ( let i = 0; i < BOARD_SIZE; i++ ) { // Row
                column.push(
                    String.fromCharCode(
                        65 + ( Math.floor( Math.random() * 25 ) )
                    )
                );
            }

            board.push( column )

        }

        // Insert words
        for ( let i = 0; i < props.words.length; i++ )
            insertWord( props.words[ i ] )

        setBoard( board )

        console.log( board ) // TODO Remove when done

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
        let wordDirection = random( Object.keys( WORD_DIRECTION ).length )

        // Generate coordinates based on direction
        switch ( wordDirection ) {

            case WORD_DIRECTION.HORIZONTAL:
                start = new Point( b, a )
                end = new Point( b + word.length, a )
                break
            case WORD_DIRECTION.VERTICAL:
                start = new Point( a, b )
                end = new Point( a, b + word.length )
                break
            case WORD_DIRECTION.DIAGONAL_UP:
            case WORD_DIRECTION.DIAGONAL_DOWN:

                start = new Point(
                    random( BOARD_SIZE - word.length + 1 ),
                    random( BOARD_SIZE - word.length + 1 )
                )

                // TODO Maybe have wordDirection determine up/down not available space
                if ( random( 2 ) && start.y + word.length - 1 - ( word.length - 1 ) >= 0 ) {
                    // Diagonal down
                    end = new Point( start.x + word.length - 1, start.y + word.length - 1 )
                    wordDirection = WORD_DIRECTION.DIAGONAL_DOWN
                } else {
                    start.y += word.length - 1
                    // Diagonal up
                    end = new Point( start.x + word.length - 1, start.y - ( word.length - 1 ) )
                    wordDirection = WORD_DIRECTION.DIAGONAL_UP
                }

        }

        return [
            start,
            end,
            wordDirection,
        ]

    }

    // Insert given word
    let insertWord = ( word ) => {

        word = word.toUpperCase()

        // Find coordinates where word would fit
        while ( true ) {

            let intersect = false
            let coords1 = generateRandomCoords( word )
            let reverse = 0

            // Check for intersections with current wotrds
            for ( let j = 0; j < wordCoords.current.length; j++ ) {
                let coords2 = wordCoords.current[ j ]

                // Retry if intersection found
                if ( doIntersect( coords1[ 0 ], coords1[ 1 ], coords2[ 0 ], coords2[ 1 ] ) ) {
                    intersect = true
                    break
                }

            }

            // Insert word if space is free
            if ( !intersect ) {

                wordCoords.current.push( coords1 )

                // Reverse 
                if ( random( 2 ) && random( 2 ) )
                    reverse = word.length - 1

                // TODO Maybe make a switch statement
                if ( coords1[ 0 ].y === coords1[ 1 ].y )
                    // Insert word across
                    for ( let i = 0; i < word.length; i++ )
                        board[ coords1[ 0 ].x + i ][ coords1[ 0 ].y ] = word[ Math.abs( i - reverse ) ]
                else if ( coords1[ 0 ].x === coords1[ 1 ].x )
                    // Insert word down
                    for ( let i = 0; i < word.length; i++ )
                        board[ coords1[ 0 ].x ][ coords1[ 0 ].y + i ] = word[ Math.abs( i - reverse ) ]
                else if ( coords1[ 0 ].y < coords1[ 1 ].y )
                    // Diagonally down
                    for ( let i = 0; i < word.length; i++ )
                        board[ coords1[ 0 ].x + i ][ coords1[ 0 ].y + i ] = word[ Math.abs( i - reverse ) ]
                else {
                    // Diagonally up
                    for ( let i = 0; i < word.length; i++ )
                        board[ coords1[ 0 ].x + i ][ coords1[ 0 ].y - i ] = word[ Math.abs( i - reverse ) ]
                }

                console.log( `${word} ${coords1[ 2 ]}` ) // TODO Remove when done

                break

            }


        }

    }

    useEffect( populateBoard, [] )

    // Populate board when new words are received
    useEffect( populateBoard, [ props.words ] )

    // Check for an answer
    useEffect( () => {
        let answerIndex = props.words.indexOf( props.answer.toLowerCase() )
        let newLines = [ ...lines ]

        // Check to see if an answer matches
        if ( answerIndex !== -1 ) {

            let coords = wordCoords.current[ answerIndex ]
            let start = coords[ 0 ]
            let end = coords[ 1 ]
            let wordDirection = coords[ 2 ]
            let diagonalAdjustment = ( BOARD_SIZE - end.y ) * 2

            let x1 = styleOffset.letterWidth * start.x
            let y1 = styleOffset.letterHeight * start.y
            let x2 = styleOffset.letterWidth * end.x
            let y2 = styleOffset.letterHeight * end.y

            // TODO Improve precision of line placement and ensure portability
            switch ( wordDirection ) {
                case WORD_DIRECTION.HORIZONTAL:
                    y1 += styleOffset.letterWidth / 2
                    y2 += styleOffset.letterWidth / 2
                    break
                case WORD_DIRECTION.VERTICAL:
                    x1 += styleOffset.letterWidth / 2
                    x2 += styleOffset.letterWidth / 2
                    break
                case WORD_DIRECTION.DIAGONAL_UP:
                    x2 += styleOffset.letterWidth
                    y1 += styleOffset.letterHeight / 2 + diagonalAdjustment
                    break
                case WORD_DIRECTION.DIAGONAL_DOWN:
                    x2 += styleOffset.letterWidth
                    y2 += styleOffset.letterHeight / 2 - diagonalAdjustment
                    break
            }

            console.log( styles.wordStroke )

            newLines.push( <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                style={styles.wordStroke}
            /> )

            setLines( newLines )

        }
    }, [ props.answer ] )

    window.onresize = () => {
        setStyleOffset( {
            // Calculate board dimensions
            width: window.screen.width * BOARD_WIDTH,
            height: window.innerHeight * BOARD_HEIGHT,
            // Calculate dimensions of letter on board
            letterWidth: window.screen.width * BOARD_WIDTH / BOARD_SIZE,
            letterHeight: window.innerHeight * BOARD_HEIGHT / BOARD_SIZE, 
        } )
    }

    let xCount = 0

    return (
        <div>
            <svg style={styles.board} ref={boardDOM} width={styleOffset.width} height={styleOffset.height}>
                {/* Background */}
                <rect style={styles.boardRect} />
                {/* Board content */}
                <text
                    style={styles.boardText}
                    fontSize={`${styleOffset.width / window.innerWidth * FS_FACTOR}vw`}
                >{
                    board.map( ( i ) => {
                        return <tspan
                            x={styleOffset.width / BOARD_SIZE * ++xCount - styleOffset.width * 0.035}
                            y={0}
                            textLength={styleOffset.height}
                        >
                            {i}
                        </tspan>
                    } )
                }</text>
                {lines}
            </svg>
        </div>
    )

}

export default Board;
