import React from 'react';

function GameInfo({ name, room }) {
  return (
    <div className="container-gameinfo">
      <h3>Name : {name}</h3>
      <h3>Room : {room}</h3>
    </div>
  );
}

export default GameInfo;
