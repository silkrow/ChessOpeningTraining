// Author: Erkai Yu, 2023

import './mychessboard.css';
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from 'react';
import { Chess } from "chess.js";

export default function Mychessboard(prop) {
  const [game, setGame] = useState(new Chess())
  const [humanIndex, setHumanIndex] = useState(0);
  const [computerIndex, setComputerIndex] = useState(1);

  useEffect(() => {
    makeComputerMove(game);
  }, [humanIndex]); // Run makeComputerMove() whenever humanIndex changes

  const pgnParser = new Chess();
  console.log(prop.choice);
  if (typeof prop.choice !== 'string') {
    console.error('Prop is not a string!');
    return;
  }
  const pgn = prop.choice.trim();
  pgnParser.loadPgn(pgn);
  const moves = pgnParser.history(); // This should return an array containing all the moves (white is even, black is odd)

  function makeComputerMove(copy) {
    if (computerIndex > humanIndex) {
      return; // No move should be made.
    }
    const possibleMoves = copy.moves();
    if (copy.isGameOver() || copy.isDraw() || possibleMoves.length === 0) return; // exit if the game is over
    const move = moves[computerIndex];
    //const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const index = possibleMoves.indexOf(move);
    if (index === -1) return; // Illegal!
    setTimeout(() => {
      const gameCopy = new Chess(copy.fen());
      //gameCopy.move(possibleMoves[randomIndex]);
      gameCopy.move(move);
      setGame(gameCopy);
      setComputerIndex(computerIndex+2); // skip user's index
    }, 200);
  }

  function onDrop(sourceSquare, targetSquare) {
    const move_made = {from: sourceSquare, to: targetSquare, promotion: "q"}
      
    // Use a copy to update the board, verify if gameCopy === correctCopy to see if user is correct
    //var gameCopy = new Chess(game.fen());
    const userCopy = new Chess(game.fen());
    const correctCopy = new Chess(game.fen()); 

    // Use try feature, therefore error caused by illegal move won't crash the program 
    try {
      const move_san = moves[humanIndex];
      const moveResult = userCopy.move(move_made);
      if (!moveResult) {
        throw new Error('Invalid move');
      }
      correctCopy.move(move_san);

      if (correctCopy.fen() !== userCopy.fen()) {
        console.log("incorrect move!");
        throw new Error("Incorrect answer");
      } 
    } catch (error) {
      //console.error(error);
      return true;
    }

    setGame(userCopy); // Update game
    //console.log("correct!")
    setHumanIndex(humanIndex + 2); // Skip computer's move
    //makeComputerMove(userCopy); // Tell computer the latest game state
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
