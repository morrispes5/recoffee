import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AlertHost } from '../components/feedback/AlertHost';
import { AppToaster } from '../components/feedback/AppToaster';
import { MotionProvider } from '../components/feedback/MotionProvider';
import { AuthProvider } from '../features/auth/AuthProvider';
import { queryClient } from '../lib/queryClient';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
        <AppToaster />
        <AlertHost />
      </QueryClientProvider>
    </MotionProvider>
  );
}
