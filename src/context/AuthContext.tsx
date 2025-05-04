
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { 
  AuthContextType, 
  Contact, 
  UserSettings, 
  defaultUserSettings 
} from '../types/auth';
import * as authService from '../services/authService';
import * as contactsService from '../services/contactsService';
import * as settingsService from '../services/settingsService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);
  const navigate = useNavigate();

  // Initialize user session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Load user settings on auth state change
        if (session?.user) {
          setTimeout(() => {
            loadUserSettingsData(session.user.id);
            fetchContactsData();
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserSettingsData(session.user.id);
        fetchContactsData();
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserSettingsData = async (userId: string) => {
    const settings = await settingsService.loadUserSettings(userId);
    setUserSettings(settings);
  };

  const fetchContactsData = async () => {
    if (!user) return;
    
    setLoadingContacts(true);
    try {
      const fetchedContacts = await contactsService.fetchContacts(user.id);
      setContacts(fetchedContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoadingContacts(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    await authService.signUp(email, password, username);
  };

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
    navigate('/');
  };

  const signOut = async () => {
    await authService.signOut();
    setContacts([]);
    setUserSettings(defaultUserSettings);
    navigate('/auth');
  };

  const addContact = async (userIdOrEmail: string) => {
    if (!user) return false;
    
    const success = await contactsService.addContact(user.id, userIdOrEmail);
    if (success) {
      fetchContactsData();
    }
    return success;
  };
  
  const removeContact = async (contactId: string) => {
    if (!user) return false;
    
    const success = await contactsService.removeContact(user.id, contactId);
    if (success) {
      fetchContactsData();
    }
    return success;
  };
  
  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    if (!user) return;
    
    const updatedSettings = await settingsService.updateUserSettings(user.id, userSettings, settings);
    setUserSettings(updatedSettings);
  };
  
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
    applyTheme: settingsService.applyTheme
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
