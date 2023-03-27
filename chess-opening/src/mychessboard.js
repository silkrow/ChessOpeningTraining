import './mychessboard.css';

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
                blocks.push(<div className="grid-itemw"><img src={`${piece_img}.png`} alt=''></img></div>)
            } else {
                blocks.push(<div className="grid-itemb"><img src={`${piece_img}.png`} alt=''></img></div>)
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
                onMouseDown={(e) => {
                    console.log('down') 
                }}
                onMouseUp={
                    () => {
                        console.log('up')
                    }
                }
                className="grid-container">
                {drawboard(props.position)}
            </div>
        </div>
    )
}

export default Mychessboard;