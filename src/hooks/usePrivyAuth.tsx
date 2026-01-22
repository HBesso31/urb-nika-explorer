import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AppUser {
  id: string;
  privy_user_id: string;
  email: string | null;
  wallet_address: string | null;
  auth_method: 'wallet' | 'email';
  created_at: string;
  updated_at: string;
}

interface PrivyAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  privyUser: ReturnType<typeof usePrivy>['user'];
  appUser: AppUser | null;
  walletAddress: string | null;
  email: string | null;
  authMethod: 'wallet' | 'email' | null;
  isAdmin: boolean;
}

interface PrivyAuthContextType extends PrivyAuthState {
  login: () => void;
  logout: () => Promise<void>;
  refreshAppUser: () => Promise<void>;
}

const PrivyAuthContext = createContext<PrivyAuthContextType | null>(null);

// Admin whitelist - can be extended via env vars in edge functions
const ADMIN_WHITELIST_EMAILS = import.meta.env.VITE_ADMIN_WHITELIST_EMAILS?.split(',').map((e: string) => e.trim().toLowerCase()) || ['humberto.besso@gmail.com'];
const ADMIN_WHITELIST_WALLETS = import.meta.env.VITE_ADMIN_WHITELIST_WALLETS?.split(',').map((w: string) => w.trim().toLowerCase()) || [];

function isWhitelisted(email: string | null, wallet: string | null): boolean {
  if (email && ADMIN_WHITELIST_EMAILS.includes(email.toLowerCase())) return true;
  if (wallet && ADMIN_WHITELIST_WALLETS.includes(wallet.toLowerCase())) return true;
  return false;
}

export function PrivyAuthProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout: privyLogout } = usePrivy();
  const { wallets } = useWallets();
  
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Get primary wallet address
  const walletAddress = wallets?.[0]?.address ?? user?.wallet?.address ?? null;
  
  // Get email
  const email = user?.email?.address ?? null;
  
  // Determine auth method
  const authMethod: 'wallet' | 'email' | null = user 
    ? (user.wallet ? 'wallet' : 'email') 
    : null;

  // Upsert user to app_users on login
  const syncAppUser = useCallback(async () => {
    if (!user) {
      setAppUser(null);
      setIsAdmin(false);
      setIsLoadingApp(false);
      return;
    }

    setIsLoadingApp(true);

    try {
      // Call edge function to upsert user (uses service role)
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/privy-sync-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            privy_user_id: user.id,
            email: email,
            wallet_address: walletAddress,
            auth_method: authMethod,
          }),
        }
      );

      if (!response.ok) {
        console.error('Failed to sync user:', await response.text());
        setIsLoadingApp(false);
        return;
      }

      const data = await response.json();
      setAppUser(data.user);
      
      // Check admin status
      const adminStatus = data.is_admin || isWhitelisted(email, walletAddress);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error syncing app user:', error);
    } finally {
      setIsLoadingApp(false);
    }
  }, [user, email, walletAddress, authMethod]);

  // Sync user when Privy auth state changes
  useEffect(() => {
    if (ready) {
      if (authenticated && user) {
        syncAppUser();
      } else {
        setAppUser(null);
        setIsAdmin(false);
        setIsLoadingApp(false);
      }
    }
  }, [ready, authenticated, user, syncAppUser]);

  const handleLogout = async () => {
    await privyLogout();
    setAppUser(null);
    setIsAdmin(false);
  };

  const value: PrivyAuthContextType = {
    isAuthenticated: authenticated,
    isLoading: !ready || isLoadingApp,
    privyUser: user,
    appUser,
    walletAddress,
    email,
    authMethod,
    isAdmin,
    login,
    logout: handleLogout,
    refreshAppUser: syncAppUser,
  };

  return (
    <PrivyAuthContext.Provider value={value}>
      {children}
    </PrivyAuthContext.Provider>
  );
}

export function usePrivyAuth() {
  const context = useContext(PrivyAuthContext);
  if (!context) {
    throw new Error('usePrivyAuth must be used within a PrivyAuthProvider');
  }
  return context;
}
