import type { CSSProperties } from 'react';
import { RouterProvider } from 'react-router-dom';
import { GlobalErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { useAppTheme } from './hooks/useAppTheme';
import './index.css';
import { router } from './router';
import './utils/chart/chartjs';

export function App() {
  const { accentColour } = useAppTheme();
  const appStyle = {
    '--colour-accent': accentColour,
  } as CSSProperties;

  return (
    <GlobalErrorBoundary>
      <div style={appStyle}>
        <RouterProvider router={router} />
      </div>
    </GlobalErrorBoundary>
  );
}
