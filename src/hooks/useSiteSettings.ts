import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  id: string;
  urbanika_contact_email: string;
  urbanika_contact_whatsapp: string;
  humberto_contact_email: string;
  humberto_contact_whatsapp: string;
  terms_url: string;
  updated_at: string;
}

const DEFAULT_SETTINGS: Omit<SiteSettings, 'id' | 'updated_at'> = {
  urbanika_contact_email: 'contacto@urbanika.mx',
  urbanika_contact_whatsapp: '+52 55 1234 5678',
  humberto_contact_email: 'humberto@urbanika.mx',
  humberto_contact_whatsapp: '+52 55 8765 4321',
  terms_url: '/terminos-y-condiciones.pdf',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.warn('Error fetching site settings:', fetchError.message);
      setError(fetchError.message);
      setSettings(null);
      setIsLoading(false);
      return;
    }

    // data can be null if no rows exist
    setSettings(data as SiteSettings | null);
    setIsLoading(false);
  };

  const updateSettings = async (updates: Partial<Omit<SiteSettings, 'id' | 'updated_at'>>) => {
    if (!settings) return { error: 'No settings to update' };

    const { data, error: updateError } = await supabase
      .from('site_settings')
      .update(updates)
      .eq('id', settings.id)
      .select()
      .single();

    if (updateError) {
      return { error: updateError.message };
    }

    setSettings(data as unknown as SiteSettings);
    return { error: null };
  };

  // Return settings or defaults
  const effectiveSettings: Omit<SiteSettings, 'id' | 'updated_at'> = settings || DEFAULT_SETTINGS;

  return {
    settings: effectiveSettings,
    rawSettings: settings,
    isLoading,
    error,
    refresh: fetchSettings,
    updateSettings,
  };
}
