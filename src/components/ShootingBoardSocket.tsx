/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { useDocumentEvent, useWindowEvent } from '../hooks/useEvent';
import io from 'socket.io-client';
import Target from './Target';
import { animated, Transition, useSpring } from 'react-spring';
import { AiFillSound } from 'react-icons/ai';
import { ImVolumeMute2 } from 'react-icons/im';
import queryString from 'query-string';
import GameInfo from './GameInfo';
// import useEvent from '../hooks/useEvent';

const AnimatedTarget = animated(Target);

interface targetInterface {
  _id: string;
  x: number;
  y: number;
  size: number;
  score: number;
}

let socket;
const URL = process.env.REACT_APP_SOCKET_API || 'http://localhost:5000';

var sound = new Howl({
  src: ['sound/shooting.wav'],
});

var soundBG = new Howl({
  src: ['sound/fluidity-100-ig-edit-4558.mp3'],
  loop: true,
  volume: 0.02,
  onend: function () {
    console.log('Finished!');
  },
});

export const ShootingBoardSocket = ({ location }) => {
  const [bgMusic, setBgMusic] = useState(true);
  const [name, setName] = useState<any>('');
  const [users, setUsers] = useState<any>([]);
  const [room, setRoom] = useState<any>('');
  const [data, setData] = useState<targetInterface[]>([]);
  const [shake, setshake] = useState(true);
  const [shootingEffect, setEffect] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  useWindowEvent('mousemove', (e: MouseEvent) => {
    if (isPointerLocked) {
      setPosition({ x: position.x + e.movementX, y: position.y + e.movementY });
    }
  });
  useWindowEvent('click', (e: MouseEvent) => {
    if (!isPointerLocked) {
      document.body.requestPointerLock();
    }
  });
  useDocumentEvent('pointerlockchange', () => {
    setIsPointerLocked(document.pointerLockElement === document.body);
  });

  // useEffect room
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(URL);
    setName(name);
    setRoom(room);
    socket.on();
    socket.emit('join', { name, room }, () => {});
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [location.search]);

  // gamestate
  useEffect(() => {
    console.log('first');
    socket.on('gameTargetsData', ({ user, targets }) => {
      disPatchUser(user);
      disPatchState(targets);
    });

    socket.on('shootingDone', (game: any) => {
      disPatchUser(game.users);
      disPatchState(game.targets);
    });
  }, []);

  const handleClickTarget = async (e) => {
    const _id = e;
    setEffect(true);
    setEffect(false);
    setshake(true);
    if (bgMusic) {
      sound.volume(0.05);
      sound.play();
    }
    socket.emit('shooting', { name, room, _id }, () => {});
  };

  // animation
  const { x } = useSpring({
    from: { x: 0 },
    x: shake ? 1 : 0,
    config: { duration: 1000 },
  });

  const disPatchState = (e: any) => {
    setData((prev) => {
      const newTarget = e;
      const targetArray = prev;
      const result = targetArray.filter((item) => {
        for (let i = 0; i < newTarget.length; i++) {
          if (item._id === newTarget[i]._id) {
            return true;
          }
        }
        return false;
      });
      const answer = [...result];
      for (let i = 0; i < newTarget.length; i++) {
        let slot = false;
        for (let x = 0; x < result.length; x++) {
          if (newTarget[i]._id === result[x]._id) {
            slot = true;
          }
        }
        if (!slot) {
          answer.push(newTarget[i]);
        }
      }
      return answer;
    });
  };

  const disPatchUser = (e: any) => {
    setUsers(e);
  };

  useEffect(() => {
    if (bgMusic) {
      soundBG.play();
    } else {
      soundBG.stop();
    }
  }, [bgMusic]);

  return (
    <animated.div
      style={{
        scale: x.to({
          range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
          output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
        }),
      }}
      className="container"
    >
      <Transition
        items={shootingEffect}
        from={{ opacity: 1, transform: 'translate3d(-50%,-50%,0) scale(1)' }}
        enter={{ opacity: 1, transform: 'translate3d(-50%,-50%,0) scale(1)' }}
        leave={{ opacity: 0, transform: 'translate3d(-50%,-50%,0) scale(0)' }}
        config={{ duration: 500 }}
      >
        {({ opacity, transform }, item) => {
          if (item) {
            // console.log(style.size);
            return (
              <animated.div
                style={{
                  opacity: opacity,
                  transform: transform,
                }}
                className="effect-shooting"
              />
            );
          }
        }}
      </Transition>
      <CrossHair />
      {/* {transitions((props, target) => {
        // console.log(props);
        // console.log(props);
        return (
          <AnimatedTarget
            style={props}
            _id={target._id}
            onClick={handleClickTarget}
            key={`target${target.size}${target.x}${target.y}`}
            x={target.x - position.x}
            y={target.y - position.y}
            size={target.size}
          />
        );
      })} */}
      <Transition
        items={data}
        from={{ opacity: 0, size: 0 }}
        enter={{ opacity: 1, size: 1 }}
        leave={{ opacity: 0, size: 0 }}
        delay={200}
      >
        {(props, target) => {
          return (
            <AnimatedTarget
              score={target.score}
              style={props}
              _id={target._id}
              onClick={handleClickTarget}
              key={target._id}
              x={target.x - position.x}
              y={target.y - position.y}
              size={target.size}
            />
          );
        }}
      </Transition>
      <GameInfo name={name} room={room} />
      <div
        className="sound-config"
        onClick={() => {
          setBgMusic(!bgMusic);
        }}
      >
        {bgMusic ? <AiFillSound /> : <ImVolumeMute2 />}
      </div>
      <UserBoard users={users} />
    </animated.div>
  );
};

const CrossHair = () => {
  return <div className="crossHair" />;
};

const UserBoard = ({ users }) => {
  // console.log(users);
  return (
    <div className="user-board">
      {users.map((e) => (
        <h3>
          {e.name.slice(0, 10)} : {e.score} score
        </h3>
      ))}
    </div>
  );
};
