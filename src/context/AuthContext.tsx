
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Contact = {
  id: string;
  user_id: string;
  contact_user_id: string;
  username: string;
  avatar_url: string | null;
  status?: "online" | "away" | "offline";
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  contacts: Contact[];
  loadingContacts: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  addContact: (contactUserIdOrEmail: string) => Promise<void>;
  removeContact: (contactId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth event:", event);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN') {
          // Load contacts after sign in (using setTimeout to avoid deadlock)
          setTimeout(() => fetchContacts(), 0);
          
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in",
          });
        } else if (event === 'SIGNED_OUT') {
          // Clear contacts on sign out
          setContacts([]);
          
          toast({
            title: "Signed out",
            description: "You have been signed out",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // If there's a session, fetch contacts
      if (currentSession?.user) {
        fetchContacts();
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const fetchContacts = async () => {
    if (!user) return;
    
    try {
      setLoadingContacts(true);
      
      // Query to get contacts with their profile information
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          id,
          user_id,
          contact_user_id,
          profiles:contact_user_id(username, avatar_url)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Transform the data to flatten the structure
      const formattedContacts: Contact[] = data.map((contact: any) => ({
        id: contact.id,
        user_id: contact.user_id,
        contact_user_id: contact.contact_user_id,
        username: contact.profiles?.username || 'Unknown User',
        avatar_url: contact.profiles?.avatar_url,
        // Default to online for demo purposes
        status: Math.random() > 0.3 ? "online" : Math.random() > 0.5 ? "away" : "offline"
      }));
      
      setContacts(formattedContacts);
    } catch (error: any) {
      toast({
        title: "Error loading contacts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingContacts(false);
    }
  };

  const addContact = async (contactUserIdOrEmail: string) => {
    if (!user) return;
    
    try {
      let contactUserId = contactUserIdOrEmail;
      
      // If it's an email, look up the user ID
      if (contactUserIdOrEmail.includes('@')) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', contactUserIdOrEmail)
          .single();
        
        if (userError || !userData) {
          throw new Error("User not found with that email");
        }
        
        contactUserId = userData.id;
      }
      
      // Prevent adding yourself
      if (contactUserId === user.id) {
        throw new Error("You cannot add yourself as a contact");
      }
      
      // Add contact
      const { error } = await supabase
        .from('contacts')
        .insert([{
          user_id: user.id,
          contact_user_id: contactUserId
        }]);
      
      if (error) {
        if (error.code === '23505') {
          throw new Error("This user is already in your contacts");
        }
        throw error;
      }
      
      toast({
        title: "Contact added",
        description: "The user has been added to your contacts",
      });
      
      // Refresh contacts
      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Error adding contact",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeContact = async (contactId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setContacts(contacts.filter(contact => contact.id !== contactId));
      
      toast({
        title: "Contact removed",
        description: "The user has been removed from your contacts",
      });
    } catch (error: any) {
      toast({
        title: "Error removing contact",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Check your email for the confirmation link",
      });
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        contacts,
        loadingContacts,
        signIn,
        signUp,
        signOut,
        addContact,
        removeContact,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
