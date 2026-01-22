import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ContributionStatus = 'pending' | 'confirmed' | 'failed';
export type Vehicle = 'investment' | 'loan';

export interface Contribution {
  id: string;
  user_id: string;
  app_user_id: string | null;
  vehicle: Vehicle;
  amount_mxn: number;
  amount_usd: number;
  network: string | null;
  financial_contract: string | null;
  tx_hash: string | null;
  status: ContributionStatus;
  created_at: string;
  updated_at: string;
}

export function useContributions(appUserId?: string) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContributions = useCallback(async () => {
    if (!appUserId) {
      setContributions([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('contributions')
      .select('*')
      .eq('app_user_id', appUserId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    setContributions((data || []) as unknown as Contribution[]);
    setIsLoading(false);
  }, [appUserId]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  // Totals
  const totalContributedMXN = contributions
    .filter(c => c.status !== 'failed')
    .reduce((sum, c) => sum + Number(c.amount_mxn), 0);

  const totalContributedUSD = contributions
    .filter(c => c.status !== 'failed')
    .reduce((sum, c) => sum + Number(c.amount_usd), 0);

  return {
    contributions,
    isLoading,
    error,
    refresh: fetchContributions,
    totalContributedMXN,
    totalContributedUSD,
  };
}
