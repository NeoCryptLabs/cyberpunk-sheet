'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { setCredentials, setLoading, logout } from './slices/auth-slice';

const GET_ME_QUERY = `
  query GetMe {
    me {
      _id
      email
      username
    }
  }
`;

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [initComplete, setInitComplete] = useState(false);

  // First, detect if we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Then, initialize auth only on client side
  useEffect(() => {
    if (!isClient) return;

    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          dispatch(setLoading(false));
          setInitComplete(true);
          return;
        }

        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/graphql',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ query: GET_ME_QUERY }),
              signal: controller.signal,
            }
          );

          clearTimeout(timeoutId);
          const data = await response.json();

          if (data.data?.me) {
            dispatch(
              setCredentials({
                user: data.data.me,
                accessToken,
                refreshToken,
              })
            );
          } else {
            // Token invalid, clear localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch(logout());
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          // Network error or timeout - clear tokens and continue
          console.error('Auth fetch failed:', fetchError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch(logout());
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        dispatch(setLoading(false));
      } finally {
        setInitComplete(true);
      }
    };

    initAuth();
  }, [isClient, dispatch]);

  // Show loading state while checking auth (only on client after hydration)
  if (!isClient || (isLoading && !initComplete)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neon-cyan-500/30 border-t-neon-cyan-500 rounded-full animate-spin" />
          <p className="text-neon-cyan-400/70 font-cyber tracking-wider">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
