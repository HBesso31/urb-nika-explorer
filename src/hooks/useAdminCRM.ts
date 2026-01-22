import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CRMContribution {
  id: string;
  user_id: string;
  app_user_id: string | null;
  user_email: string | null;
  wallet_address: string | null;
  registration_method: 'email' | 'wallet';
  vehicle: string;
  amount_mxn: number;
  amount_usd: number;
  status: string;
  tx_hash: string | null;
  created_at: string;
}

export type VehicleFilter = 'all' | 'loan' | 'investment';
export type StatusFilter = 'all' | 'pending' | 'confirmed' | 'failed';

interface AppUser {
  id: string;
  privy_user_id: string;
  email: string | null;
  wallet_address: string | null;
  auth_method: 'wallet' | 'email';
}

export function useAdminCRM() {
  const [contributions, setContributions] = useState<CRMContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
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
      // Fetch contributions
      const { data: contributionsData, error: contribError } = await supabase
        .from('contributions')
        .select('*')
        .order('created_at', { ascending: false });

      if (contribError) throw contribError;

      // Get unique app_user_ids (for Privy users)
      const appUserIds = [...new Set(
        (contributionsData || [])
          .map(c => c.app_user_id)
          .filter(Boolean)
      )];

      // Fetch app_users for Privy users
      let appUsersMap = new Map<string, AppUser>();
      if (appUserIds.length > 0) {
        const { data: appUsersData, error: appUsersError } = await supabase
          .from('app_users')
          .select('*')
          .in('id', appUserIds);

        if (appUsersError) {
          console.warn('Error fetching app_users:', appUsersError);
        } else {
          appUsersMap = new Map(
            (appUsersData || []).map(u => [u.id, u as AppUser])
          );
        }
      }

      // Transform data for CRM view
      const crmData: CRMContribution[] = (contributionsData || []).map(c => {
        // Check if this is a Privy user (has app_user_id)
        const appUser = c.app_user_id ? appUsersMap.get(c.app_user_id) : null;

        return {
          id: c.id,
          user_id: c.user_id,
          app_user_id: c.app_user_id || null,
          user_email: appUser?.email || null,
          wallet_address: appUser?.wallet_address || null,
          registration_method: appUser?.auth_method || 'email',
          vehicle: c.vehicle,
          amount_mxn: c.amount_mxn,
          amount_usd: c.amount_usd,
          status: c.status,
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

  // Approve a contribution (change status to confirmed)
  const approveContribution = async (id: string): Promise<{ error?: string }> => {
    setUpdatingId(id);
    try {
      const { error: updateError } = await supabase
        .from('contributions')
        .update({ status: 'confirmed' })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      setContributions(prev => 
        prev.map(c => c.id === id ? { ...c, status: 'confirmed' } : c)
      );

      return {};
    } catch (err) {
      console.error('Error approving contribution:', err);
      return { error: err instanceof Error ? err.message : 'Error al aprobar' };
    } finally {
      setUpdatingId(null);
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
    // Approve function
    approveContribution,
    updatingId,
    // Filters
    vehicleFilter,
    setVehicleFilter,
    statusFilter,
    setStatusFilter,
    // Stats
    stats,
  };
}
