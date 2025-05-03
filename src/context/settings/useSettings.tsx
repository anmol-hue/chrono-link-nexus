
import { useState, useEffect } from 'react';
import { UserSettings, defaultUserSettings } from '../../types/auth';
import * as settingsService from '../../services/settingsService';

export const useSettings = (userId: string | undefined) => {
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);

  useEffect(() => {
    if (userId) {
      loadUserSettingsData(userId);
    }
  }, [userId]);

  const loadUserSettingsData = async (userId: string) => {
    const settings = await settingsService.loadUserSettings(userId);
    setUserSettings(settings);
  };
  
  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    if (!userId) return;
    
    const updatedSettings = await settingsService.updateUserSettings(userId, userSettings, settings);
    setUserSettings(updatedSettings);
  };

  return {
    userSettings,
    updateUserSettings,
    applyTheme: settingsService.applyTheme
  };
};
