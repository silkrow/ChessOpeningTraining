import './App.css';
import Oldchessboard from './oldchessboard.js'
import { useState, useMemo } from 'react';

function OldApp() {
  const [pool, setPool] = useState("human");

  const [myChoice, setMyChoice] = useState("human");
  
  const handleChange = (event) => {
    setMyChoice(event.target.value)
  }

  // useMemo is used here to avoid App being rendered twice when new choice is made
  const memoizedChessboard = useMemo(() => {
    return <Oldchessboard choice={pool} />;
  }, [pool]);

  return (
    <div className="App">
      {memoizedChessboard}
      <form>
        <select value={myChoice} onChange={handleChange}>
          <option value="human">play with human</option>
          <option value="computer">play with random computer</option>
        </select>
      </form>
      <button
        type="button"
        onClick={() => {
          setPool(myChoice);
          }
        }
      >Set</button>
    </div>
  );
}

export default OldApp;
