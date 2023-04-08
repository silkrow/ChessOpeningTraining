// Author: Erkai Yu, 2023

import './mychessboard.css';
import { Chessboard } from "react-chessboard";
import { useState } from 'react';
import { Chess } from "chess.js";

export default function Mychessboard(prop) {
    const [game, setGame] = useState(new Chess());
  
    function onDrop(sourceSquare, targetSquare) {
      const move_made = {from: sourceSquare, to: targetSquare, promotion: "q"}
      
      const gameCopy = new Chess(game.fen());

      try {
        const moveResult = gameCopy.move(move_made);
        if (!moveResult) {
          throw new Error('Invalid move');
        }
        console.log(moveResult);
      } catch (error) {
        console.error(error);
      }

      setGame(gameCopy);
      return true;
    }
  
    return (<div id="board-container" >
    <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
    );
  }
