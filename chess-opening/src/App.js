import './App.css';
import Mychessboard from './mychessboard.js'
import PoolGen from './poolgen';
import { Chess } from 'chess.js'

const chessgame = new Chess()

console.log(chessgame.pgn())

function App() {
  return (
    <div className="App">
      <Mychessboard position={chessgame} />
      <PoolGen/>
    </div>
  );
}

export default App;
