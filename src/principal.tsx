import React from 'react';
import ReactDOM from 'react-dom/client';
import { Aplicacion } from './Aplicacion';
import './styles/global.css';

const elementoRaiz = document.getElementById('root');

if (!elementoRaiz) {
  throw new Error('No se encontró el elemento contenedor raíz #root en el DOM.');
}

ReactDOM.createRoot(elementoRaiz).render(
  <React.StrictMode>
    <Aplicacion />
  </React.StrictMode>
);

