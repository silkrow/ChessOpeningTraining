// Author: Erkai Yu, 2023

import './mychessboard.css';

// --------------------------------
// Constants
// --------------------------------

const SQUARE_WIDTH = 80 //px
const BOARD_WIDTH = 8*SQUARE_WIDTH

// -------------------------------- 
// Own Features
// --------------------------------

//var isMouseDown = false; // Dragging?
//var prevX, prevY;


// drawboard
// input: A position object from chess.js
// output: Draw the whole board (background images and pieces) on the center of the screen 

function drawboard(props) {
    const blocks = []
    for (var i = 8; i > 0; i--) // i for rows
        for (var j = 0; j < 8; j++) {// j for columns
            var piece_img = ''
            var query_piece = props.get(String.fromCharCode(97+j)+i.toString());
            if (query_piece !== false) {
                piece_img += query_piece.color;
                piece_img += query_piece.type; 
            } 
            if ((i + j)%2 === 0) {
                blocks.push(<div className="grid-itemw" id={`${piece_img}_id`}
                        >
                        <img src={`${piece_img}.png`} alt=''></img></div>
                    )
            } else {
                blocks.push(<div className="grid-itemb" id={`${piece_img}_id`}
                >
                <img src={`${piece_img}.png`} alt=''></img></div>
            )
            }
        }
    return blocks;
}

function Mychessboard (props) {
    if (props.choice === "begin") {
        props.position.reset();
    }
    if (props.choice === "end"){
        while (!props.position.isGameOver()) {
            const moves = props.position.moves()
            const move = moves[Math.floor(Math.random() * moves.length)]
            props.position.move(move)
        }
    }


    return (
        <div>
            <p>{props.position.fen()}</p>
            <div 
                className="grid-container">
                {drawboard(props.position)}
            </div>
        </div>
    )
}

export default Mychessboard;