import React from 'react';
import { useState } from 'react';
import TileView from './TileView';
import Cell from './Cell';
import { Board } from '../helpers/index';
import useEvent from '../hooks/useEvent';
import { GameOverlay } from './GameOverlay';

const BoardView = () => {
  const [board, setBoard] = useState(new Board());
  const [timeplay, setTimePlay] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimePlay(timeplay + 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [timeplay]);

  React.useEffect(() => {
    
  }, [timeplay]);

  const handleKeyDown = (event: any) => {
    if (board.hasWon()) {
      return;
    }
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      let direction = event.keyCode - 37;
      let boardClone = Object.assign(
        Object.create(Object.getPrototypeOf(board)),
        board
      );
      let newBoard = boardClone.move(direction);
      setBoard(newBoard);
    }
  };
  const handleResetGame = () => {
    setBoard(new Board());
  };
  // event
  useEvent('keydown', handleKeyDown);

  const cells = board.cells.map((row, rowIndex) => {
    return (
      <div key={rowIndex}>
        {row.map((col, colIndex) => {
          return <Cell key={rowIndex + board.size + colIndex} />;
        })}
      </div>
    );
  });
  const tiles = board.tiles
    .filter((tile) => tile.value !== 0)
    .map((tile, index) => {
      return <TileView key={index} tile={tile} />;
    });

  return (
    <div>
      <div className="details-box">
        <div className="resetButton" onClick={handleResetGame}>
          Reset Game
        </div>
        <div className="score-box">
          <div className="score-header">SCORE</div>
          <div>{board.score}</div>
        </div>
      </div>
      <div className="board">
        {cells}
        {tiles}
        <GameOverlay onRestart={handleResetGame} board={board} />
      </div>
      <div className="timeDetails">Time : {timeplay} seconds</div>
    </div>
  );
};

export default BoardView;
