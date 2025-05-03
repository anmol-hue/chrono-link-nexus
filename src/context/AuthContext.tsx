
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Contact {
  id: string;
  username: string;
  avatar_url?: string;
  status?: 'online' | 'away' | 'offline';
  contact_user_id: string;
}

interface UserSettings {
  themeColor: string;
  notificationSound: boolean;
  messagePreview: boolean;
  messageEffect: string;
  compactMode: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  contacts: Contact[];
  loadingContacts: boolean;
  addContact: (userIdOrEmail: string) => Promise<void>;
  removeContact: (contactId: string) => Promise<void>;
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  applyTheme: (color: string) => void;
}

const defaultUserSettings: UserSettings = {
  themeColor: 'blue',
  notificationSound: true,
  messagePreview: true,
  messageEffect: 'fade',
  compactMode: false,
};

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
            loadUserSettings(session.user.id);
            fetchContacts();
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserSettings(session.user.id);
        fetchContacts();
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserSettings = async (userId: string) => {
    try {
      // Try to get settings directly from the user's profile
      const { data, error } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data && data.settings) {
        // If settings exist, use them - need to handle type conversion safely
        const loadedSettings = data.settings as unknown;
        setUserSettings({ 
          ...defaultUserSettings, 
          ...(loadedSettings as UserSettings) 
        });
        applyTheme((loadedSettings as UserSettings)?.themeColor || defaultUserSettings.themeColor);
      } else {
        // If settings don't exist, use defaults and update profile
        setUserSettings(defaultUserSettings);
        applyTheme(defaultUserSettings.themeColor);
        
        // Try to update the profile with default settings
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              settings: defaultUserSettings as unknown as Json
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating user settings:', updateError);
          }
        } catch (updateError) {
          console.error('Error updating profile with default settings:', updateError);
        }
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      setUserSettings(defaultUserSettings);
    }
  };

  const fetchContacts = async () => {
    if (!user) return;
    
    setLoadingContacts(true);
    try {
      // Get the contact user_ids that the current user has
      const { data: contactLinks, error: contactsError } = await supabase
        .from('contacts')
        .select('contact_user_id')
        .eq('user_id', user.id);
        
      if (contactsError) throw contactsError;
      
      if (contactLinks && contactLinks.length > 0) {
        // Get the profile information for each contact
        const contactUserIds = contactLinks.map(c => c.contact_user_id);
        
        const { data: contactProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, status')
          .in('id', contactUserIds);
          
        if (profilesError) throw profilesError;
        
        // Combine the data
        const userContacts: Contact[] = contactProfiles.map(profile => {
          return {
            id: profile.id,
            username: profile.username || 'Unknown User',
            avatar_url: profile.avatar_url,
            status: (profile.status as 'online' | 'away' | 'offline') || 'offline',
            contact_user_id: profile.id
          };
        });
        
        setContacts(userContacts);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoadingContacts(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
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

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate('/');
      toast.success('Successfully signed in!');
    } catch (error: any) {
      toast.error(error.message || 'Incorrect email or password');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setContacts([]);
      setUserSettings(defaultUserSettings);
      navigate('/auth');
      toast.success('Successfully signed out');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  const addContact = async (userIdOrEmail: string) => {
    if (!user) return;
    
    try {
      let contactUserId = userIdOrEmail;
      
      // Check if input is an email
      if (userIdOrEmail.includes('@')) {
        // Look up the user ID from email
        const { data: userData, error: userError } = await supabase
          .from('auth_users')
          .select('id')
          .eq('email', userIdOrEmail)
          .single();
          
        if (userError || !userData) {
          // Try to find user in profiles that might have an email field
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', userIdOrEmail)
            .single();
            
          if (profileError || !profileData) {
            toast.error('User not found with that email');
            return;
          }
          
          contactUserId = profileData.id;
        } else {
          contactUserId = userData.id;
        }
      }
      
      // Check if trying to add self
      if (contactUserId === user.id) {
        toast.error("You can't add yourself as a contact");
        return;
      }
      
      // Check if the contact exists
      const { data: contactExists, error: checkError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', contactUserId)
        .single();
        
      if (checkError || !contactExists) {
        toast.error('User not found');
        return;
      }
      
      // Check if already a contact
      const { data: existingContact, error: existingError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .eq('contact_user_id', contactUserId)
        .maybeSingle();
        
      if (existingContact) {
        toast.error('This user is already in your contacts');
        return;
      }
      
      // Add the contact
      const { error } = await supabase
        .from('contacts')
        .insert({
          user_id: user.id,
          contact_user_id: contactUserId
        });
        
      if (error) throw error;
      
      toast.success(`${contactExists.username || 'User'} added to contacts`);
      await fetchContacts();
    } catch (error: any) {
      console.error('Error adding contact:', error);
      toast.error(error.message || 'Failed to add contact');
    }
  };
  
  const removeContact = async (contactId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('user_id', user.id)
        .eq('contact_user_id', contactId);
        
      if (error) throw error;
      
      toast.success('Contact removed successfully');
      await fetchContacts();
    } catch (error: any) {
      console.error('Error removing contact:', error);
      toast.error(error.message || 'Failed to remove contact');
    }
  };
  
  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    if (!user) return;
    
    try {
      const updatedSettings = { ...userSettings, ...settings };
      
      const { error } = await supabase
        .from('profiles')
        .update({ settings: updatedSettings as unknown as Json })
        .eq('id', user.id);
        
      if (error) {
        console.error('Settings update failed:', error);
        
        // Just apply the theme change in the UI but don't persist
        if (settings.themeColor) {
          applyTheme(settings.themeColor);
        }
        
        return;
      }
      
      setUserSettings(updatedSettings);
      
      if (settings.themeColor) {
        applyTheme(settings.themeColor);
      }
    } catch (error: any) {
      console.error('Error updating user settings:', error);
      toast.error(error.message || 'Failed to update settings');
    }
  };
  
  const applyTheme = (color: string) => {
    document.documentElement.style.setProperty('--theme-color', getThemeColor(color));
    document.documentElement.setAttribute('data-theme', color);
  };
  
  const getThemeColor = (color: string): string => {
    switch (color) {
      case 'purple': return '#9B30FF';
      case 'green': return '#39FF14';
      case 'pink': return '#FF10F0';
      case 'blue':
      default: return '#00FFFF';
    }
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
