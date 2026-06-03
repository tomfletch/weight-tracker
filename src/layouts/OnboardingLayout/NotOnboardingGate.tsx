import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSettings } from '~/hooks/useAppSettings';

type OnboardingGateProps = {
  children: ReactNode;
};

export function NotOnboardingGate({ children }: OnboardingGateProps) {
  const { hasCompletedOnboarding } = useAppSettings();

  if (hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
