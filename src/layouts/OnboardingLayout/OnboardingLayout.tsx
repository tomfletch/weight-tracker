import { Outlet } from 'react-router-dom';
import { NotOnboardingGate } from './NotOnboardingGate';

export function OnboardingLayout() {
  return (
    <NotOnboardingGate>
      <Outlet />
    </NotOnboardingGate>
  );
}
