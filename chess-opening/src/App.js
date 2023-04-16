import "./App.css";
import Mychessboard from "./mychessboard.js";
import React, { useState, useEffect } from "react";
import * as d3 from "d3";

function App() {
  const [openings, setOpenings] = useState([]); // Containing all the openings that can be chosen
  const [selectedOpenings, setSelectedOpenings] = useState(new Set()); // Containing the selected openings
  const [openingPool, setOpeningPool] = useState(new Set()); // Containing the openings that are being used (will shrink)
  const [loadflag, setLoadflag] = useState(false); // prevent multiple loading
  const [traininging, setTraininging] = useState(false); // Indicate whether training is going on

  useEffect(() => {
    if (!loadflag){
      d3.tsv("TSV/all.tsv", function(data) {
        setOpenings(prevOpenings => [...prevOpenings, data]);
      });
    }
    setLoadflag(true);
  }, [loadflag, openings]);

  useEffect(() => {
    if (traininging && openingPool.size === 0){
      setTraininging(false);
    }
  }, [traininging, openingPool])

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

  const getRandomOpening = () => {
    if (openingPool.size !== 0) {
      var openingArray = Array.from(openingPool);
      var randomIndex = Math.floor(Math.random() * openingArray.length);
      var randomOpening = openingArray[randomIndex];
      openingPool.delete(randomOpening);
    // return randomOpening; // Would be a string in the form of "....#pgn#...."
    return randomOpening.split("#pgn#")[1];
    }

    return "" // Else, return an empty string to indicate on training
  };

  return (
    <div className="App">
      <br></br>
      <div className="ongoing-left">
        <p>{openingPool.size} openings left</p>
        <h3>Ongoing Opening</h3>
      </div>
      <Mychessboard choice={getRandomOpening()}/>
      <h2>Pick Openings to Train!</h2>
      {openings.length > 0 && 
        (!traininging ? (
        <select size={20} multiple={true} value={[...selectedOpenings]} onChange={handleSelectChange}>
        {openings.map((opening) => (
          <option value={opening.Index+". "+opening.name + "#pgn#" + opening.pgn}>{opening.Index+". "+opening.name}</option>
        ))}
        </select>
        ):(<p>Training started!</p>))}
      <div>
        <div className="optioncontainer-right">
          <h3>Number of selected openings: {selectedOpenings.size}</h3>
          {Array.from(selectedOpenings).map((openingstr) => (
          <p>{openingstr.split("#pgn#")[0]}</p>
          ))}
        </div>
        <button className="optionbutton" 
        onClick={() => {
          setOpeningPool(new Set(selectedOpenings));
          if (selectedOpenings.size > 0){
            setTraininging(true);
          }
        }}
          >Start Training</button>
      </div>
    </div>
  );
}

export default App;
