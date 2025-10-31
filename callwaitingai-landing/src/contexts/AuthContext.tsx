import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        // Use getSession() instead of getUser() - it doesn't throw AuthSessionMissingError
        // when no session exists, which is the expected state for logged-out users
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        // Only log actual errors, not missing sessions (which is normal)
        if (sessionError && sessionError.name !== 'AuthSessionMissingError') {
          console.error('Error loading session:', sessionError);
        }

        setUser(session?.user || null);

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Error loading user profile:', profileError);
          }

          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      } catch (error: any) {
        // Silently handle AuthSessionMissingError - this is normal for logged-out users
        if (error?.name === 'AuthSessionMissingError') {
          console.debug('No active session found (user is logged out)');
        } else {
          console.error('Unexpected error in loadUser:', error);
        }
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
            .then(({ data }) => setUserProfile(data));
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const result = await supabase.auth.signInWithPassword({ email, password });

    // Ensure session is properly set after login
    if (result.data?.session) {
      // Wait a moment for auth state to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Force refresh user state using getSession
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        setUserProfile(profile);
      }
    }

    return result;
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: {
          full_name: fullName,
        },
        // Add captcha to help with rate limiting (if enabled in Supabase)
        captchaToken: undefined, // Can be populated if using captcha
      }
    });

    // Handle rate limit errors with better messaging
    if (authError) {
      const errorMessage = authError.message?.toLowerCase() || '';
      const isRateLimitError = 
        errorMessage.includes('rate limit') ||
        errorMessage.includes('too many') ||
        errorMessage.includes('429') ||
        errorMessage.includes('email rate') ||
        authError.status === 429;

      if (isRateLimitError) {
        // Re-throw with more user-friendly message
        throw new Error('Email rate limit reached. Please wait a few minutes before trying again. If you need immediate access, please contact support.');
      }
      
      // Throw original error for other cases
      throw authError;
    }

    // Create user profile after successful signup
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          full_name: fullName,
          role: 'client',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;
    }

    return {
      ...authData,
      needsEmailVerification: !authData.session, // If no session, email verification needed
    };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
