// Author: Erkai Yu, 2023

import './mychessboard.css';
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from 'react';
import { Chess } from "chess.js";

// --------------------------
// Varibles
// --------------------------
var gameMode = 'human'; // By default, set mode to 'human'


export default function Mychessboard(prop) {
  const [game, setGame] = useState(new Chess());

  // useEffect is used here to detect the change of prop
  useEffect(() => {
    console.log("prop has changed:", prop);

    // Update game mode, reset the game
    gameMode = prop.choice;
    setGame(new Chess());

  }, [prop]);


  function makeComputerMove(copy) {
    const possibleMoves = copy.moves();
    if (copy.isGameOver() || copy.isDraw() || possibleMoves.length === 0) return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    setTimeout(() => {
      const gameCopy = new Chess(copy.fen());
      gameCopy.move(possibleMoves[randomIndex]);
      setGame(gameCopy);
    }, 200);
  }

  function onDrop(sourceSquare, targetSquare) {
    const move_made = {from: sourceSquare, to: targetSquare, promotion: "q"}
      
    // Use a copy to update the board
    const gameCopy = new Chess(game.fen());

    // Use try feature, therefore error caused by illegal move won't crash the program 
    try {
      const moveResult = gameCopy.move(move_made);
      if (!moveResult) {
        throw new Error('Invalid move');
      }
      console.log(moveResult);
    } catch (error) {
      console.error(error);
      return true;
    }

    setGame(gameCopy); // Update game

    if (gameMode === 'computer') {
      makeComputerMove(gameCopy); // Tell computer the latest game state
    }


    return true;
  }
  
  return (<div id="board-container" >
  <Chessboard position={game.fen()} 
  customBoardStyle={{
    borderRadius: "4px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
  }}
  customDarkSquareStyle={{ backgroundColor: "#C71585" }}
  customLightSquareStyle={{ backgroundColor: "#edeed1" }}
  onPieceDrop={onDrop} />
  </div>
  );
}
