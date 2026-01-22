import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CRMContribution {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  registration_method: 'email' | 'wallet';
  vehicle: string;
  amount_mxn: number;
  amount_usd: number;
  status: string;
  network: string | null;
  financial_contract: string | null;
  tx_hash: string | null;
  created_at: string;
}

export type VehicleFilter = 'all' | 'loan' | 'investment';
export type StatusFilter = 'all' | 'pending' | 'confirmed' | 'failed';

export function useAdminCRM() {
  const [contributions, setContributions] = useState<CRMContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    fetchCRMData();
  }, []);

  const fetchCRMData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch contributions with user profiles
      const { data: contributionsData, error: contribError } = await supabase
        .from('contributions')
        .select('*')
        .order('created_at', { ascending: false });

      if (contribError) throw contribError;

      // Get unique user IDs
      const userIds = [...new Set(contributionsData?.map(c => c.user_id) || [])];

      // Fetch profiles for those users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Fetch user emails from auth (via profiles user_id match)
      // Since we can't query auth.users directly, we'll use the user_id
      // For V2-A, we'll show "email" as registration method since Privy isn't integrated yet
      
      const profilesMap = new Map(
        profilesData?.map(p => [p.user_id, p]) || []
      );

      // Transform data for CRM view
      const crmData: CRMContribution[] = (contributionsData || []).map(c => {
        const profile = profilesMap.get(c.user_id);
        return {
          id: c.id,
          user_id: c.user_id,
          user_email: null, // Will be fetched separately if needed
          user_name: profile?.full_name || null,
          registration_method: 'email' as const, // Default for V2-A (no Privy yet)
          vehicle: c.vehicle,
          amount_mxn: c.amount_mxn,
          amount_usd: c.amount_usd,
          status: c.status,
          network: c.network,
          financial_contract: c.financial_contract,
          tx_hash: c.tx_hash,
          created_at: c.created_at,
        };
      });

      setContributions(crmData);
    } catch (err) {
      console.error('Error fetching CRM data:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos CRM');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered and sorted data
  const filteredContributions = useMemo(() => {
    return contributions.filter(c => {
      if (vehicleFilter !== 'all' && c.vehicle !== vehicleFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      return true;
    });
  }, [contributions, vehicleFilter, statusFilter]);

  // Summary stats
  const stats = useMemo(() => {
    const totalMXN = filteredContributions.reduce((sum, c) => sum + c.amount_mxn, 0);
    const totalUSD = filteredContributions.reduce((sum, c) => sum + c.amount_usd, 0);
    const pending = filteredContributions.filter(c => c.status === 'pending').length;
    const confirmed = filteredContributions.filter(c => c.status === 'confirmed').length;
    const loans = filteredContributions.filter(c => c.vehicle === 'loan').length;
    const investments = filteredContributions.filter(c => c.vehicle === 'investment').length;

    return {
      totalRecords: filteredContributions.length,
      totalMXN,
      totalUSD,
      pending,
      confirmed,
      loans,
      investments,
    };
  }, [filteredContributions]);

  return {
    contributions: filteredContributions,
    allContributions: contributions,
    isLoading,
    error,
    refresh: fetchCRMData,
    // Filters
    vehicleFilter,
    setVehicleFilter,
    statusFilter,
    setStatusFilter,
    // Stats
    stats,
  };
}
