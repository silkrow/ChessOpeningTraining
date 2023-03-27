import './App.css';
import Mychessboard from './mychessboard.js'
import { Chess } from 'chess.js'
import { useState } from 'react';

const chessgame = new Chess()

console.log(chessgame.pgn())

function App() {
  const [pool, setPool] = useState("begin");

  const [myChoice, setMyChoice] = useState("begin");
  
  const handleChange = (event) => {
    setMyChoice(event.target.value)
  }

  return (
    <div className="App">
      <Mychessboard position={chessgame} choice={pool} />
      <form>
        <select value={myChoice} onChange={handleChange}>
          <option value="begin">Start</option>
          <option value="end">End</option>
        </select>
      </form>
      <button
        type="button"
        onClick={() => {
          setPool(myChoice)
          }
        }
      >Set</button>
    </div>
  );
}

export default App;
