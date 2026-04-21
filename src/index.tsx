import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { initDevMockDataHydration } from './stores/devMockDataHydration';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

initDevMockDataHydration();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
