import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useUserRole() {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const checkRole = async () => {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.warn('Error checking user role:', error.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
      
      setIsLoading(false);
    };

    checkRole();
  }, [user, authLoading]);

  return { isAdmin, isLoading: isLoading || authLoading };
}
