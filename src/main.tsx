import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import {initializeTheme} from './theme/themeState';
import './theme/theme.css';

initializeTheme();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
