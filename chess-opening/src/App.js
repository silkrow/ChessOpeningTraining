import './App.css';

import { Chess } from 'chess.js'

const chess = new Chess()

while (!chess.isGameOver()) {
  const moves = chess.moves()
  const move = moves[Math.floor(Math.random() * moves.length)]
  chess.move(move)
}
console.log(chess.pgn())

function App() {
  return (
    <div className="App">
      <h1>Hello World!</h1>
	  <p>{chess.pgn()}</p>
    </div>
  );
}

export default App;
