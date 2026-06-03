import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '~/components/ErrorBoundary/ErrorBoundary';
import { NotOnboardingGate } from './NotOnboardingGate';

export function OnboardingLayout() {
  return (
    <NotOnboardingGate>
      <main>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </NotOnboardingGate>
  );
}
