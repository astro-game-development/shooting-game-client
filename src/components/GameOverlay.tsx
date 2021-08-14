import React from 'react';
import { Board } from '../helpers';
import TryAgain from '../assets/img/try-again.gif';

interface Props {
  onRestart: () => any;
  board: Board;
}

export const GameOverlay = ({ onRestart, board }: Props) => {
  if (board.hasWon()) {
    return <div className="tile2048"></div>;
  } else if (board.hasLost()) {
    return (
      <div className="gameOver" onClick={onRestart}>
        <img
          style={{ width: '100%', height: '100%', cursor: 'pointer' }}
          alt="Try Again"
          src={TryAgain}
        ></img>
      </div>
    );
  }
  return null;
};
