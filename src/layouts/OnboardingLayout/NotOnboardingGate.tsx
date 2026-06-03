import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '~/stores/appStore';

type OnboardingGateProps = {
  children: ReactNode;
};

export function NotOnboardingGate({ children }: OnboardingGateProps) {
  const hasCompletedOnboarding = useAppStore(
    (state) => state.hasCompletedOnboarding,
  );

  if (hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
