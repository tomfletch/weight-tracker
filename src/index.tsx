import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { runLegacyLocalStorageToAppStoreMigration } from './migrations/legacyLocalStorageToAppStore';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

runLegacyLocalStorageToAppStoreMigration();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
