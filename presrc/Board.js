
import React, { useState, useRef, useEffect, } from "react"
import { doIntersect, Point } from "./mutils";

// Constants

// TODO Maybe make board bigger
const BOARD_SIZE = 12
const BOARD_AREA = BOARD_SIZE * BOARD_SIZE
const FONT_SIZE = window.innerWidth * 0.047 // Size for board font
const COLUMN_SIZE = FONT_SIZE*0.7 // Size of each column

const INVALID_WORDS_MSG = "Invalid words provided:"

// Enums

const WORD_DIRECTION = {
    HORIZONTAL: 0,
    VERTICAL: 1,
    DIAGONAL: 2,
}

// Style

const styles = {
    startBoard: {
        position: "fixed",
    },
    foundWord: {
        textDecoration: "line-through",
        textDecorationColor: "red",
    },
    svg: {
        width: window.innerWidth * 0.431,
        height: COLUMN_SIZE * 12,
    },
    boardText: {
        fontSize: FONT_SIZE,
        writingMode: "tb",
        textOrientation: "upright",
    },
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

    // TODO Store columns in board not arrays to format text alignment better
    let [ board, setBoard ] = useState( [] ) // Board data
    let [ lines, setLines ] = useState( [] )
    let [ renderSwitch, reRender ] = useState( true ) // TODO Remove if not needed
    let wordCoords = useRef( [] )
    let [ boardStyle, setBoardStyle ] = useState( styles.startBoard )
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
            insertWord( props.words[i] )

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

                // Reverse 
                if ( random( 2 ) && random( 2 ) )
                    reverse = word.length - 1

                console.log( coords1 )

                // TODO Maybe verify that this works
                switch ( wordDirection ) {

                    case WORD_DIRECTION.HORIZONTAL:
                         // Insert word across
                        for ( let i = 0; i < word.length; i++ )
                            board[ coords1[0].x + i ][ coords1[0].y ] = word[Math.abs( i - reverse )]
                    case WORD_DIRECTION.VERTICAL:
                         // Insert word down
                        for ( let i = 0; i < word.length; i++ )
                            board[ coords1[0].x ][ coords1[0].y + i] = word[Math.abs( i - reverse )]
                    case WORD_DIRECTION.DIAGONAL:
                        if ( coords1[0].y < coords1[1].y )
                            // Diagonally down
                            for ( let i = 0; i < word.length; i++ )
                                board[ coords1[0].x + i ][ coords1[0].y + i ] = word[Math.abs( i - reverse )]
                        else {
                            // Diagonally up
                            for ( let i = 0; i < word.length; i++ )
                                board[ coords1[0].x + i ][ coords1[0].y - i ] = word[Math.abs( i - reverse )]
                     }
                }

            }


        }

    }

    // TODO Fix resizing(Position and size better)
    // TODO Figure out how to do this with a reference 
    let resizeBoard = () => setBoardStyle( {
        ...styles.startBoard,
        left: window.innerWidth * 0.5 - boardDOM.current.width.baseVal.value / 2,
        top: window.innerHeight * 0.5 - boardDOM.current.height.baseVal.value / 2,
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

    // Resize on board change(For initial render)
    useEffect( resizeBoard, [ board ] )

    // TODO Respond to user finding a word(Doesn't render response for some reason)
    // Check for an answer
    useEffect( () => {
        let answerIndex = props.words.indexOf( props.answer.toLowerCase() )
        let newLines = [...lines]
        
        // Check to see if an answer matches
        if ( answerIndex !== -1 ) {
            
            let coords = wordCoords.current[answerIndex]
            let start = coords[0]
            let end = coords[1]
            let wordDirection = coords[2]

            let letterWidth = styles.svg.width / 12
            let letterHeight = styles.svg.height / 12

            let x1 = letterWidth * start.x
            let y1 = letterHeight * start.y
            let x2 = letterWidth * end.x
            let y2 = letterHeight * end.y

            // TODO Finish this(Not precises/Diagonal positioning)
            switch ( wordDirection ) {
                case WORD_DIRECTION.HORIZONTAL:
                    y1 += letterWidth/2
                    y2 += letterWidth/2
                    break
                case WORD_DIRECTION.VERTICAL:
                    x1 += letterWidth/2
                    x2 += letterWidth/2
                    break
                case WORD_DIRECTION.DIAGONAL:
                    
                    break
            }

            newLines.push( <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                style={{
                    stroke: "red",
                    strokeWidth: 4,
                }}
            /> )
    
            
            setLines( newLines )
            
        }
    }, [ props.answer ] )

    let xCount = 0

    return ( <svg style={boardStyle} ref={boardDOM} width={styles.svg.width} height={styles.svg.height}>
        {/* Background */}
        <rect width={styles.svg.width} height={styles.svg.height} rx={10} fill="white" />
        {/* Board content */}
        {/* TODO Fix letter spacing */}
        <text style={styles.boardText} x={0} y={0}>{
            board.map( ( i ) => { 
                return <tspan
                    x={styles.svg.width/BOARD_SIZE * ++xCount - styles.svg.width*0.035}
                    y={0}
                    textLength={styles.svg.width*0.9}
                >
                {i}
            </tspan> } )
}</text>
        {lines}
    </svg> )

}

export default Board;
