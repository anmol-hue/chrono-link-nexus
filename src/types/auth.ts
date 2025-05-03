
import { User, Session } from '@supabase/supabase-js';
import { Database } from '../integrations/supabase/types';

export type Json = Database["public"]["Tables"]["profiles"]["Row"]["settings"];

export interface Contact {
  id: string;
  username: string;
  avatar_url?: string;
  status?: 'online' | 'away' | 'offline';
  contact_user_id: string;
}

export interface UserSettings {
  themeColor: string;
  notificationSound: boolean;
  messagePreview: boolean;
  messageEffect: string;
  compactMode: boolean;
}

export const defaultUserSettings: UserSettings = {
  themeColor: 'blue',
  notificationSound: true,
  messagePreview: true,
  messageEffect: 'fade',
  compactMode: false,
};

export interface AuthContextType {
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
