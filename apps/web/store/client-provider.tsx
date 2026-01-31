'use client';

import { StoreProvider } from './provider';
import { AuthInitializer } from './auth-initializer';

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AuthInitializer>{children}</AuthInitializer>
    </StoreProvider>
  );
}
