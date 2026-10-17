import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import {initializeTheme} from './theme/themeState';
import {initializeUiScale} from './theme/uiPreferences';
import './theme/theme.css';

initializeTheme();
initializeUiScale();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
