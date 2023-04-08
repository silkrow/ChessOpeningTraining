import './App.css';
import Mychessboard from './mychessboard.js'
import { useState } from 'react';

function App() {
  const [pool, setPool] = useState("human");

  const [myChoice, setMyChoice] = useState("human");
  
  const handleChange = (event) => {
    setMyChoice(event.target.value)
  }

  return (
    <div className="App">
      <Mychessboard choice={pool} />
      <form>
        <select value={myChoice} onChange={handleChange}>
          <option value="human">play with human</option>
          <option value="computer">play with random computer</option>
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
