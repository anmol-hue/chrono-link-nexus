
import { useState, useEffect } from 'react';
import { Contact } from '../../types/auth';
import * as contactsService from '../../services/contactsService';

export const useContacts = (userId: string | undefined) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchContactsData();
    }
  }, [userId]);

  const fetchContactsData = async () => {
    if (!userId) return;
    
    setLoadingContacts(true);
    const fetchedContacts = await contactsService.fetchContacts(userId);
    setContacts(fetchedContacts);
    setLoadingContacts(false);
  };
  
  const addContact = async (userIdOrEmail: string) => {
    if (!userId) return;
    
    const success = await contactsService.addContact(userId, userIdOrEmail);
    if (success) {
      fetchContactsData();
    }
  };
  
  const removeContact = async (contactId: string) => {
    if (!userId) return;
    
    const success = await contactsService.removeContact(userId, contactId);
    if (success) {
      fetchContactsData();
    }
  };

  return {
    contacts,
    loadingContacts,
    addContact,
    removeContact
  };
};
