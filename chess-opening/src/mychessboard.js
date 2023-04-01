// Author: Erkai Yu, 2023

import './mychessboard.css';

// -------------------------------- 
// Own Features
// --------------------------------

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
                blocks.push(<div className="grid-itemw"
                        onMouseEnter={
                            (e) => { 
                                console.log('mouse over me')
                            }
                        }>
                        <img src={`${piece_img}.png`} alt=''></img></div>
                    )
            } else {
                blocks.push(<div className="grid-itemb"
                        onMouseEnter={
                            (e) => { 
                                console.log('mouse over me')
                            }
                        }>
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
                onMouseUp={ // Attempt to placing a piece
                    () => {
                        console.log('up')
                    }
                }
                onMouseDown={ // Start dragging a piece
                    (e) => { 
                        console.log('down')
                    }
                }
                onMouseMove={ // Moving
                    (e) => { 
                    }
                }
                className="grid-container">
                {drawboard(props.position)}
            </div>
        </div>
    )
}

export default Mychessboard;