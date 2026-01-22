import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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

export function useUserBenefits() {
  const { user } = useAuth();
  const [userBenefits, setUserBenefits] = useState<UserBenefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setUserBenefits([]);
      setIsLoading(false);
      return;
    }
    fetchUserBenefits();
  }, [user]);

  const fetchUserBenefits = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('user_benefits')
      .select('*')
      .order('created_at', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    setUserBenefits((data || []) as unknown as UserBenefit[]);
    setIsLoading(false);
  };

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
