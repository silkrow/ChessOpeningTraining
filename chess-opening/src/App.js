import "./App.css";
import Mychessboard from "./mychessboard.js";
import React, { useState, useEffect } from "react";
import * as d3 from "d3";

function App() {
  const [openings, setOpenings] = useState([]);
  const [loadflag, setLoadflag] = useState(false); // prevent multiple loading

  useEffect(() => {
    if (!loadflag){
      d3.tsv("TSV/all.tsv", function(data) {
        setOpenings(prevOpenings => [...prevOpenings, data]);
      });
    }
    setLoadflag(true);
  }, [loadflag, openings]);


  return (
    <div className="App">
      <Mychessboard />
        {openings.length > 0 && (
            <select>
            {openings.map((opening) => (
            <option value={opening.name}>{opening.name}</option>
          ))}
            </select>
        )}

    </div>
  );
}

export default App;
