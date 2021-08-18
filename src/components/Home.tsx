import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createGame, joinGame } from '../api/game.collection';

function Home() {
  let history = useHistory();
  const [name, setName] = useState('');
  const [room, setroom] = useState('');

  const onClickCreateGame = async (e: any) => {
    e.preventDefault();
    if (name) {
      createGame()
        .then((res) => {
          console.log(res.data);
          history.push(`/game?name=${name}&room=${res.data.room}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onClickJoinGame = async (e: any) => {
    e.preventDefault();
    if (name && room) {
      joinGame(room)
        .then((res) => {
          history.push(`/game?name=${name}&room=${room}`);
        })
        .catch((err) => {
          setroom('');
          console.log(err);
        });
    }
  };
  return (
    <div className="container container-home">
      <div className="content-home">
        <h1>Shooting Game</h1>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Enter name"
          type="text"
          className="input-name"
        />
        <button onClick={onClickCreateGame}>Create game</button>
        <h2>Join Room</h2>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Enter name"
          type="text"
          className="input-name"
        />
        <input
          value={room}
          onChange={(e) => {
            setroom(e.target.value.toUpperCase());
          }}
          placeholder="Enter Room name"
          type="text"
          className="input-name"
        />
        <button onClick={onClickJoinGame}>Join</button>
      </div>
    </div>
  );
}

export default Home;
