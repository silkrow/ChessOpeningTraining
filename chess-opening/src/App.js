import './App.css';
import Mychessboard from './mychessboard.js'
import PoolGen from './poolgen';
import { Chess } from 'chess.js'

const chessgame = new Chess()

while (!chessgame.isGameOver()) {
  const moves = chessgame.moves()
  const move = moves[Math.floor(Math.random() * moves.length)]
  chessgame.move(move)
}
console.log(chessgame.pgn())

function App() {
  return (
    <div className="App">
      <h1>Chess Opening Training</h1>
      <Mychessboard position={chessgame} />
      <PoolGen/>
    </div>
  );
}

export default App;
