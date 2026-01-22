import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type ContributionStatus = 'pending' | 'confirmed' | 'failed';
export type Vehicle = 'investment' | 'loan';

export interface Contribution {
  id: string;
  user_id: string;
  vehicle: Vehicle;
  amount_mxn: number;
  amount_usd: number;
  network: string | null;
  tx_hash: string | null;
  status: ContributionStatus;
  created_at: string;
  updated_at: string;
}

export function useContributions() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setContributions([]);
      setIsLoading(false);
      return;
    }
    fetchContributions();
  }, [user]);

  const fetchContributions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('contributions')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    setContributions((data || []) as unknown as Contribution[]);
    setIsLoading(false);
  };

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
