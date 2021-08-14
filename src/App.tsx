import React from 'react';
import BoardView from './components/BoardView';

const App = () => {
  return (
    <div className="container">
      <h1>2048</h1>
      <BoardView />
    </div>
  );
};

export default App;
