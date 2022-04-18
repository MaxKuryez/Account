import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes/routes';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);
