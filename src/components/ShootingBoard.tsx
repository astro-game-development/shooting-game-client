import React, { useState, useEffect, useMemo } from 'react';
import { Howl, Howler } from 'howler';
import { useDocumentEvent, useWindowEvent } from '../hooks/useEvent';
import Target from './Target';
import {
  animated,
  useTransition,
  Transition,
  useSpring,
  config,
} from 'react-spring';
import _ from 'lodash';
import useInterval from '../hooks/useInterval';
import { getGame, shooting } from '../api/game.collection';
import { AiFillSound } from 'react-icons/ai';
import { ImVolumeMute2 } from 'react-icons/im';
// import useEvent from '../hooks/useEvent';

const AnimatedTarget = animated(Target);

interface targetInterface {
  _id: string;
  x: number;
  y: number;
  size: number;
}
interface dataInterface {
  target: targetInterface[];
}

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

export const ShootingBoard = () => {
  const [bgMusic, setBgMusic] = useState(true);
  const [data, setData] = useState<dataInterface>({ target: [] });
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

  const handleClickTarget = async (e) => {
    const _idTarget = e;
    setEffect(true);
    setEffect(false);
    setshake(true);
    if (bgMusic) {
      sound.volume(0.05);
      sound.play();
    }
    await shooting('6118cef01329b02f28c9578b', _idTarget);
    // const i = data.target.findIndex((item) => {
    //   return e === item._id;
    // });
    // const targetArray = [...data.target];
    // targetArray.splice(i, 1);
    // setData({ target: targetArray });
  };

  // animation

  const { x } = useSpring({
    from: { x: 0 },
    x: shake ? 1 : 0,
    config: { duration: 1000 },
  });

  const fetchdata = async () => {
    const targetPoll = await getGame('6118cef01329b02f28c9578b');
    const newTarget = targetPoll.data.target;

    const targetArray = [...data.target];

    const result = targetArray.filter((item) => {
      for (let i = 0; i < newTarget.length; i++) {
        if (item._id === newTarget[i]._id) {
          return true;
        }
      }
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

    setData({ ...data, target: answer });
  };

  useInterval(() => {
    fetchdata();
  }, 100);

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
        items={data.target}
        from={{ opacity: 0, size: 0 }}
        enter={{ opacity: 1, size: 1 }}
        leave={{ opacity: 0, size: 0 }}
        delay={200}
      >
        {(props, target) => {
          return (
            <AnimatedTarget
              style={props}
              _id={target._id}
              onClick={handleClickTarget}
              key={props._id}
              x={target.x - position.x}
              y={target.y - position.y}
              size={target.size}
            />
          );
        }}
      </Transition>
      <div
        className="sound-config"
        onClick={() => {
          setBgMusic(!bgMusic);
        }}
      >
        {bgMusic ? <AiFillSound /> : <ImVolumeMute2 />}
      </div>
    </animated.div>
  );
};

const CrossHair = () => {
  return <div className="crossHair" />;
};
