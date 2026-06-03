import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSettings } from '~/hooks/useAppSettings';

type OnboardingGateProps = {
  children: ReactNode;
};

export function OnboardingGate({ children }: OnboardingGateProps) {
  const { hasCompletedOnboarding } = useAppSettings();

  if (!hasCompletedOnboarding) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}
