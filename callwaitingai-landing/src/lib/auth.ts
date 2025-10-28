import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at?: string;
}

export const authService = {
  // Sign up new user with email verification
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: {
          email,
        }
      },
    });

    if (error) throw error;
    
    // Return user data and session
    return {
      user: data.user,
      session: data.session,
      needsEmailVerification: !data.session, // If no session, email verification needed
    };
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Provide more helpful error messages
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.');
      }
      throw error;
    }
    
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Resend verification email
  async resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) throw error;
    return { success: true, message: 'Verification email sent successfully' };
  },

  // Verify email with token (called from redirect)
  async verifyEmail(token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) throw error;
    return data;
  },

  // Reset password request
  async requestPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return { success: true, message: 'Password reset email sent' };
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { success: true, message: 'Password updated successfully' };
  },

  // Create user profile in database after email verification
  async createUserProfile(user: any) {
    const { error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        full_name: '',
        role: 'client',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return { success: true };
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },
};
