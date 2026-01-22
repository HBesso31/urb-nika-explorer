import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type BenefitStatus = 'locked' | 'unlocked';

export interface UserBenefit {
  id: string;
  user_id: string;
  benefit_name: string;
  status: BenefitStatus;
  unlocked_at: string | null;
  notes: string | null;
  created_at: string;
}

// TODO: Add app_user_id to user_benefits table when needed
// For now, benefits will be empty for Privy users until migration is complete
export function useUserBenefits(appUserId?: string) {
  const [userBenefits, setUserBenefits] = useState<UserBenefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBenefits = useCallback(async () => {
    if (!appUserId) {
      setUserBenefits([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    // TODO: Update query when app_user_id is added to user_benefits table
    // For now, return empty - Privy users don't have benefits linked yet
    setUserBenefits([]);
    setIsLoading(false);
  }, [appUserId]);

  useEffect(() => {
    fetchUserBenefits();
  }, [fetchUserBenefits]);

  const unlockedBenefits = userBenefits.filter(b => b.status === 'unlocked');
  const lockedBenefits = userBenefits.filter(b => b.status === 'locked');

  return {
    userBenefits,
    unlockedBenefits,
    lockedBenefits,
    isLoading,
    error,
    refresh: fetchUserBenefits,
  };
}
