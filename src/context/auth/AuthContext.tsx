
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { useSettings } from '../settings/useSettings';
import { useContacts } from '../contacts/useContacts';
import { AuthContextType } from '../../types/auth';
import * as authService from '../../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Import functionality from separate hooks
  const { 
    userSettings,
    updateUserSettings,
    applyTheme
  } = useSettings(user?.id);
  
  const {
    contacts,
    loadingContacts,
    addContact,
    removeContact
  } = useContacts(user?.id);

  // Initialize user session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth methods
  const signUp = async (email: string, password: string, username: string) => {
    await authService.signUp(email, password, username);
  };

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signOut = async () => {
    await authService.signOut();
  };
  
  // Combine all context values
  const contextValue: AuthContextType = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
    contacts,
    loadingContacts,
    addContact,
    removeContact,
    userSettings,
    updateUserSettings,
    applyTheme
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
