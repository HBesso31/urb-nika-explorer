import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

// TODO: Add app_user_id to payouts table when needed
// For now, payouts will be empty for Privy users until migration is complete
export function usePayouts(appUserId?: string) {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayouts = useCallback(async () => {
    if (!appUserId) {
      setPayouts([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    // TODO: Update query when app_user_id is added to payouts table
    // For now, return empty - Privy users don't have payouts linked yet
    setPayouts([]);
    setIsLoading(false);
  }, [appUserId]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

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
