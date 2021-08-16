import React from 'react';
import { useWindowEvent } from '../hooks/useEvent';

const Target = ({ size, x, y, _id, onClick, style }) => {
  const ycoor = y * (size / 100);
  const xcoor = x * (size / 100);
  const handleClick = (e: any) => {
    // console.log('click', size);
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
        // zIndex: 3,
      }}
    ></div>
  );
};

export default Target;
