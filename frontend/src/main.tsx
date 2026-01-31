import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

setTimeout(() => {
  const loading = document.getElementById('loading');
  const root = document.getElementById('root');
  
  if (loading && loading.parentNode) {
    loading.style.opacity = '0';
    loading.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => {
      loading.parentNode.removeChild(loading);
      if (root) root.classList.add('loaded');
    }, 300);
  }
}, 100);
