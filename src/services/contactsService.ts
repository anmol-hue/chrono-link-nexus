
import { supabase } from '../integrations/supabase/client';
import { Contact } from '../types/auth';
import { toast } from 'sonner';

export const fetchContacts = async (userId: string): Promise<Contact[]> => {
  if (!userId) return [];
  
  try {
    // Get the contact user_ids that the current user has
    const { data: contactLinks, error: contactsError } = await supabase
      .from('contacts')
      .select('contact_user_id')
      .eq('user_id', userId);
      
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
      
      return userContacts;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
    toast.error('Failed to load contacts');
    return [];
  }
};

export const addContact = async (userId: string, userIdOrEmail: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    let contactUserId = userIdOrEmail;
    
    // Check if input is an email or username
    if (userIdOrEmail.includes('@')) {
      // We can't directly query auth.users through the Supabase client
      // So we'll just try to find the user in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .ilike('username', `%${userIdOrEmail}%`)
        .maybeSingle();
          
      if (profileError || !profileData) {
        toast.error('User not found with that email or username');
        return false;
      }
      
      contactUserId = profileData.id;
    }
    
    // Check if trying to add self
    if (contactUserId === userId) {
      toast.error("You can't add yourself as a contact");
      return false;
    }
    
    // Check if the contact exists
    const { data: contactExists, error: checkError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', contactUserId)
      .single();
      
    if (checkError || !contactExists) {
      toast.error('User not found');
      return false;
    }
    
    // Check if already a contact
    const { data: existingContact, error: existingError } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('contact_user_id', contactUserId)
      .maybeSingle();
      
    if (existingContact) {
      toast.error('This user is already in your contacts');
      return false;
    }
    
    // Add the contact
    const { error } = await supabase
      .from('contacts')
      .insert({
        user_id: userId,
        contact_user_id: contactUserId
      });
      
    if (error) throw error;
    
    toast.success(`${contactExists.username || 'User'} added to contacts`);
    return true;
  } catch (error: any) {
    console.error('Error adding contact:', error);
    toast.error(error.message || 'Failed to add contact');
    return false;
  }
};

export const removeContact = async (userId: string, contactId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('user_id', userId)
      .eq('contact_user_id', contactId);
      
    if (error) throw error;
    
    toast.success('Contact removed successfully');
    return true;
  } catch (error: any) {
    console.error('Error removing contact:', error);
    toast.error(error.message || 'Failed to remove contact');
    return false;
  }
};
