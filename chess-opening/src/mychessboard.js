// Author: Erkai Yu, 2023

import './mychessboard.css';
import { Chessboard } from "react-chessboard";
import { useState } from 'react';
import { Chess } from "chess.js";


// RandomMoveEngine



export default function Mychessboard() {
    const [game, setGame] = useState(new Chess());
  
    // function makeAMove(move) {
    //   //const gameCopy = { ...game };
    //   const gameCopy = new Chess(game.fen());
    //   const result = gameCopy.move(move);
    //   setGame(gameCopy);
    //   return result; // null if the move was illegal, the move object if the move was legal
    // }
  
    // function makeRandomMove() {
    //   const possibleMoves = game.moves();
    //   if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) return; // exit if the game is over
    //   const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    //   makeAMove(possibleMoves[randomIndex]);
    // }
  
    function onDrop(sourceSquare, targetSquare) {
      // const move = makeAMove({
      //   from: sourceSquare,
      //   to: targetSquare,
      //   promotion: "q", // always promote to a queen for example simplicity
      // });

      const move_made = {from: sourceSquare, to: targetSquare, promotion: "q"}
      
      const gameCopy = new Chess(game.fen());

      try {
        const moveResult = gameCopy.move(move_made);
        if (!moveResult) {
          throw new Error('Invalid move');
        }
        console.log(moveResult);
        console.log(gameCopy.fen());
      } catch (error) {
        console.error(error);
      }

      setGame(gameCopy);
      console.log(game.fen());
      return true;
    }
  
    return (<div id="board-container" >
    <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
    );
  }
