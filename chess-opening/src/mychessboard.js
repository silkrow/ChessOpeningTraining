function Mychessboard (props) {
    return (
        <div>
            <p>{props.position.fen()}</p>
        </div>
    )
}

export default Mychessboard;