import "./App.css";
import Mychessboard from "./mychessboard.js";
import React, { useState, useEffect } from "react";
import * as d3 from "d3";

function App() {
  const [openings, setOpenings] = useState([]);
  const [selectedOpenings, setSelectedOpenings] = useState(new Set());
  const [openingPool, setOpeningPool] = useState(new Set());
  const [loadflag, setLoadflag] = useState(false); // prevent multiple loading

  useEffect(() => {
    if (!loadflag){
      d3.tsv("TSV/all.tsv", function(data) {
        setOpenings(prevOpenings => [...prevOpenings, data]);
      });
    }
    setLoadflag(true);
  }, [loadflag, openings]);

  const handleSelectChange = (e) => {
    const optionValue = e.target.value;
    const newSelectedOpenings = new Set(selectedOpenings);
    if (newSelectedOpenings.has(optionValue)) {
      newSelectedOpenings.delete(optionValue);
    } else {
      newSelectedOpenings.add(optionValue);
    }
    setSelectedOpenings(newSelectedOpenings);
  };


  return (
    <div className="App">
      <br></br>
      <Mychessboard pool={openingPool}/>
      <h2>Pick Openings to Train!</h2>
      {openings.length > 0 && 
        (openingPool.size === 0 ? (
        <select size={20} multiple={true} value={[...selectedOpenings]} onChange={handleSelectChange}>
        {openings.map((opening) => (
          <option value={opening.Index+". "+opening.name}>{opening.Index+". "+opening.name}</option>
        ))}
        </select>
        ):(<p>Training started!</p>))}
      <div>
        <div className="optioncontainer-right">
          <h3>Number of selected openings: {selectedOpenings.size}</h3>
          {Array.from(selectedOpenings).map((opening) => (
          <p>{opening}</p>
          ))}
        </div>
        <button className="optionbutton" 
        onClick={() => {
          setOpeningPool(selectedOpenings);
        }}
          >Start Training</button>
      </div>
    </div>
  );
}

export default App;
