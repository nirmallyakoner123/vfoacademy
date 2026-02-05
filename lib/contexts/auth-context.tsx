'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn as authSignIn, signOut as authSignOut, getCurrentUser, onAuthStateChange } from '../services/auth.service';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Enums']['user_role'];

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isLearner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session on mount
    getCurrentUser().then((profile) => {
      setUser(profile);
      setLoading(false);
    });

    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange((profile) => {
      setUser(profile);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn({ email, password });
    
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    
    return { success: false, error: result.error };
  };

  const signOut = async () => {
    await authSignOut();
    setUser(null);
  };

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'instructor';
  const isLearner = user?.role === 'learner';

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
    isLearner,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
