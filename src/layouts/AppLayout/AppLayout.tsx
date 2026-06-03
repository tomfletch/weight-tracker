import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '~/components/ErrorBoundary/ErrorBoundary';
import { Header } from '~/components/Header/Header';
import { OnboardingGate } from '~/layouts/AppLayout/OnboardingGate';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <OnboardingGate>
      <a href="#main-content" className={styles.skipToContent}>
        Skip to content
      </a>
      <Header />
      <main id="main-content" className={styles.mainContent}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </OnboardingGate>
  );
}
