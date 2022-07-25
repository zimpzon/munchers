import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GameLoader from './Components/GameLoader';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GameLoader>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </GameLoader>
);
