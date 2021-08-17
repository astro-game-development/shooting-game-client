import React from 'react';
import { ShootingBoard } from './components/ShootingBoard';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home';
// import ShootingBoard2 from './components/ShootingBoard2';

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/game/:id" exact component={ShootingBoard} />
    </Router>
  );
};

export default App;
