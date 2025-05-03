
import { supabase } from '../integrations/supabase/client';
import { Json, UserSettings, defaultUserSettings } from '../types/auth';
import { toast } from 'sonner';

export const loadUserSettings = async (userId: string): Promise<UserSettings> => {
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
      const mergedSettings = { 
        ...defaultUserSettings, 
        ...(loadedSettings as UserSettings) 
      };
      
      applyTheme(mergedSettings.themeColor || defaultUserSettings.themeColor);
      return mergedSettings;
    } else {
      // If settings don't exist, use defaults and update profile
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
      
      return defaultUserSettings;
    }
  } catch (error) {
    console.error('Error loading user settings:', error);
    return defaultUserSettings;
  }
};

export const updateUserSettings = async (
  userId: string,
  currentSettings: UserSettings,
  newSettings: Partial<UserSettings>
): Promise<UserSettings> => {
  if (!userId) return currentSettings;
  
  try {
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    const { error } = await supabase
      .from('profiles')
      .update({ settings: updatedSettings as unknown as Json })
      .eq('id', userId);
      
    if (error) {
      console.error('Settings update failed:', error);
      
      // Just apply the theme change in the UI but don't persist
      if (newSettings.themeColor) {
        applyTheme(newSettings.themeColor);
      }
      
      return currentSettings;
    }
    
    if (newSettings.themeColor) {
      applyTheme(newSettings.themeColor);
    }
    
    return updatedSettings;
  } catch (error: any) {
    console.error('Error updating user settings:', error);
    toast.error(error.message || 'Failed to update settings');
    return currentSettings;
  }
};

export const applyTheme = (color: string): void => {
  document.documentElement.style.setProperty('--theme-color', getThemeColor(color));
  document.documentElement.setAttribute('data-theme', color);
};

export const getThemeColor = (color: string): string => {
  switch (color) {
    case 'purple': return '#9B30FF';
    case 'green': return '#39FF14';
    case 'pink': return '#FF10F0';
    case 'blue':
    default: return '#00FFFF';
  }
};
