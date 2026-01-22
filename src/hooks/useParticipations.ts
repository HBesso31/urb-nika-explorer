import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePrivyAuth } from './usePrivyAuth';
import type { Scenario } from '@/lib/simulatorV2';
import { simulateInvestmentV2, simulateLoanV2 } from '@/lib/simulatorV2';

export type ParticipationType = 'investment' | 'loan';
export type ParticipationStatus = 'pending' | 'active' | 'closed';

export interface Participation {
  id: string;
  type: ParticipationType;
  amount: number;
  term_months: number;
  scenario: Scenario;
  status: ParticipationStatus;
  estimated_return: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateParticipationInput {
  type: ParticipationType;
  amount: number;
  termMonths: number;
  scenario: Scenario;
  notes?: string;
}

export function useParticipations() {
  const { appUser } = usePrivyAuth();
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appUser) {
      setParticipations([]);
      setIsLoading(false);
      return;
    }

    fetchParticipations();
  }, [appUser]);

  const fetchParticipations = async () => {
    if (!appUser) return;
    
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('participations')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    // Type assertion since we know the structure
    setParticipations((data || []) as unknown as Participation[]);
    setIsLoading(false);
  };

  const createParticipation = async (input: CreateParticipationInput) => {
    if (!appUser) return { error: 'Not authenticated' };

    // Calculate estimated return based on type and scenario
    let estimatedReturn = 0;
    if (input.type === 'investment') {
      const result = simulateInvestmentV2({
        amount: input.amount,
        termMonths: input.termMonths,
        scenario: input.scenario,
      });
      estimatedReturn = result.totalProfit;
    } else {
      const result = simulateLoanV2({
        amount: input.amount,
        termMonths: input.termMonths,
        scenario: input.scenario,
      });
      estimatedReturn = result.totalInterest;
    }

    const { data, error: insertError } = await supabase
      .from('participations')
      .insert({
        user_id: appUser.id,
        type: input.type,
        amount: input.amount,
        term_months: input.termMonths,
        scenario: input.scenario,
        estimated_return: estimatedReturn,
        notes: input.notes || null,
      })
      .select()
      .single();

    if (insertError) {
      return { error: insertError.message };
    }

    // Refresh list
    await fetchParticipations();
    return { error: null, data };
  };

  const totalInvested = participations
    .filter(p => p.type === 'investment' && p.status !== 'closed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalLoaned = participations
    .filter(p => p.type === 'loan' && p.status !== 'closed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return {
    participations,
    isLoading,
    error,
    createParticipation,
    refresh: fetchParticipations,
    totalInvested,
    totalLoaned,
  };
}
