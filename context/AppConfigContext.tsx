import request from '@/Api/axios';
import { createContext, useContext, useEffect, useState } from 'react';

export type SmsSettingsMap = {
  [key: string]: string;
};

export type AppConfigContextType = {
  smsSettings: SmsSettingsMap | null;
  setSmsSettings: (settings: SmsSettingsMap) => void;
};

export const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (context === undefined) throw new Error('useAppConfig must be used within an AppConfigProvider');
  return context;
};

export const AppConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [smsSettings, setSmsSettings] = useState<SmsSettingsMap | null>(null);

  useEffect(() => {
    const fetchSmsSettings = async () => {
      try {
        const res = await request.get('/collections/sms_settings/records?perPage=200'); // آدرس رو تغییر بده
        const data = await res.data;

        // // تبدیل آرایه به آبجکت
        const map: SmsSettingsMap = {};
        for (const item of data.items) {
          const key = item.title.replace(/\s+/g, '_').toLowerCase(); // مثلا 'new request' → 'new_request'
          map[key] = item.value;
        }

        setSmsSettings(map);
      } catch (err) {
        console.error('Error fetching sms settings:', err);
      }
    };

    fetchSmsSettings();
  }, []);

  return (
    <AppConfigContext.Provider value={{ smsSettings, setSmsSettings }}>
      {children}
    </AppConfigContext.Provider>
  );
};

