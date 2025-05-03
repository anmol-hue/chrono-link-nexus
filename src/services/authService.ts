
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { defaultUserSettings } from '../types/auth';
import { Json } from '../types/auth';

export const signUp = async (email: string, password: string, username: string): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) throw error;

    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username,
            settings: defaultUserSettings as unknown as Json,
            status: 'online'
          }
        ]);

      if (profileError) throw profileError;
    }

    toast.success('Account created! Please check your email to verify your account.');
  } catch (error: any) {
    toast.error(error.message || 'An error occurred during sign up');
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    toast.success('Successfully signed in!');
  } catch (error: any) {
    toast.error(error.message || 'Incorrect email or password');
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    toast.success('Successfully signed out');
  } catch (error: any) {
    toast.error(error.message || 'Error signing out');
  }
};
