// src/main.tsx

import React from 'react'; // 💡 NECESARIO para usar <React.StrictMode>
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// import './index.css';  <--- 💡 Elimina esta línea ya que borraste index.css

createRoot(document.getElementById('root')!).render(
  <React.StrictMode> // <--- 💡 Usar <React.StrictMode>
    <App />
  </React.StrictMode>,
);