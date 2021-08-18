import React from 'react';
import { useWindowEvent } from '../hooks/useEvent';

interface TargetProps {
  size: any;
  x: any;
  y: any;
  _id: any;
  onClick: (e: any) => any;
  style: any;
  score?: any;
}

const Target = ({ size, x, y, _id, onClick, style, score }: TargetProps) => {
  const ycoor = y * (size / 100);
  const xcoor = x * (size / 100);
  const colorChange = (e: any) => {
    console.log('ggg', e);
    if (e < 5) {
      return '#865439';
    } else if (e < 10) {
      return '#3D087B';
    } else if (e < 15) {
      return '#F43B86';
    } else if (e < 20) {
      return '#FFE459';
    } else if (e < 25) {
      return '#0CECDD';
    } else if (e < 30) {
      return '#FE9898';
    } else if (e < 45) {
      return '#7DEDFF';
    } else if (e < 50) {
      return '#FF7600';
    } else {
      return '#BF1363';
    }
  };
  const handleClick = (e: any) => {
    e.preventDefault();
    let wx = window.innerWidth / 2,
      wy = window.innerHeight / 2;
    let r = size / 2;
    let cx = xcoor + r,
      cy = ycoor + r;

    let d = Math.sqrt(Math.pow(cx - wx, 2) + Math.pow(cy - wy, 2));

    if (d <= r) {
      onClick(_id);
    }

    // console.log(size, d);
  };

  // const getDisplayCoordinates = () => {
  //   let xc = x * (size / 100);
  //   let yc = y * (size / 100);
  //   return { xc, yc };
  // };

  useWindowEvent('click', handleClick);

  let styleChange = `translate3d(${xcoor}px, ${ycoor}px, 0) scale(${style.opacity})`;
  return (
    <div
      className="target"
      style={{
        opacity: `${style.opacity}`,
        transform: styleChange,
        width: size,
        height: size,
        backgroundColor: colorChange(score),
      }}
    >
      <div className="target-inside"></div>
    </div>
  );
};

export default Target;
