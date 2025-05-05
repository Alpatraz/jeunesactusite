// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Assurez-vous que cette ligne est présente
import App from './App';
import './styles.css';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
