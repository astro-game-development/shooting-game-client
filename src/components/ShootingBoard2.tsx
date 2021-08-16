import React, { Component } from 'react';

export default class ShootingBoard2 extends Component {
  state = { x: 0, y: 0 };
  componentDidMount() {
    let isPointerLocked = false;
    window.addEventListener('click', () => {
      if (!isPointerLocked) {
        document.body.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      console.log('ok');
      isPointerLocked = document.pointerLockElement === document.body;
    });

    let x = 0;
    let y = 0;
    document.addEventListener('mousemove', (e) => {
      if (isPointerLocked) {
        x += e.movementX;
        y += e.movementY;
        this.setState({ x, y });
      }
    });
  }
  render() {
    return (
      <div
        className="target"
        style={{
          transform: `translate3d(${this.state.x}px, ${this.state.y}px, 0)`,
        }}
      ></div>
    );
  }
}
