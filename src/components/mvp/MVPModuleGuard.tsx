import React from 'react';
import { Navigate } from 'react-router-dom';
import { isMvpEnabledPath } from '@/config/moduleConfig';

interface MVPModuleGuardProps {
  modulePath: string;
  children: React.ReactNode;
}

/**
 * mini-mvp branch only.
 * Wraps a portal module route. If the module is not MVP-enabled, redirects
 * the user back to /portal so they cannot directly navigate to locked content.
 */
export function MVPModuleGuard({ modulePath, children }: MVPModuleGuardProps) {
  if (!isMvpEnabledPath(modulePath)) {
    return <Navigate to="/portal" replace />;
  }
  return <>{children}</>;
}
