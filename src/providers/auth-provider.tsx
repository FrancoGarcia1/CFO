'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types/domain';

interface AuthUser {
  id: string;
  email?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = useCallback(async () => {
    try {
      const supabase = createClient();

      // getSession() is fast — reads from local storage/cookies, no HTTP
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data as UserProfile | null);
      }

      setLoading(false);

      // Listen for future auth changes (login/logout)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          const sessionUser = newSession?.user ?? null;
          setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email } : null);

          if (sessionUser) {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', sessionUser.id)
              .single();
            setProfile(data as UserProfile | null);
          } else {
            setProfile(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cleanup = initAuth();
    return () => { cleanup.then(fn => fn?.()); };
  }, [initAuth]);

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
