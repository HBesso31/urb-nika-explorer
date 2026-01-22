import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Payout {
  id: string;
  user_id: string;
  vehicle: 'investment' | 'loan';
  amount_mxn: number;
  amount_usd: number;
  paid_at: string;
  notes: string | null;
  created_at: string;
}

export function usePayouts() {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPayouts([]);
      setIsLoading(false);
      return;
    }
    fetchPayouts();
  }, [user]);

  const fetchPayouts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('payouts')
      .select('*')
      .order('paid_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    setPayouts((data || []) as unknown as Payout[]);
    setIsLoading(false);
  };

  // Totals
  const totalReceivedMXN = payouts.reduce((sum, p) => sum + Number(p.amount_mxn), 0);
  const totalReceivedUSD = payouts.reduce((sum, p) => sum + Number(p.amount_usd), 0);

  return {
    payouts,
    isLoading,
    error,
    refresh: fetchPayouts,
    totalReceivedMXN,
    totalReceivedUSD,
  };
}
