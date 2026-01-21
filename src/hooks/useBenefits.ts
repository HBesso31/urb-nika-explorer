import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Benefit {
  id: string;
  type: string;
  title: string;
  description: string;
  min_investment: number;
  is_active: boolean;
  created_at: string;
}

export function useBenefits() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('benefits')
      .select('*')
      .order('min_investment', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    setBenefits((data || []) as unknown as Benefit[]);
    setIsLoading(false);
  };

  const getUnlockedBenefits = (investedAmount: number) => {
    return benefits.filter(b => Number(b.min_investment) <= investedAmount);
  };

  const getLockedBenefits = (investedAmount: number) => {
    return benefits.filter(b => Number(b.min_investment) > investedAmount);
  };

  return {
    benefits,
    isLoading,
    error,
    getUnlockedBenefits,
    getLockedBenefits,
  };
}
