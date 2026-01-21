import { useState, useEffect } from 'react';
import { walletClient, WalletState, WalletInfo } from '@/lib/walletClient';

export interface UseWalletReturn {
  state: WalletState;
  walletInfo: WalletInfo | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  formattedAddress: string | null;
}

export function useWallet(): UseWalletReturn {
  const [state, setState] = useState<WalletState>(walletClient.state);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(walletClient.walletInfo);
  const [error, setError] = useState<string | null>(walletClient.error);

  useEffect(() => {
    const unsubscribe = walletClient.subscribe(() => {
      setState(walletClient.state);
      setWalletInfo(walletClient.walletInfo);
      setError(walletClient.error);
    });

    return () => {
      unsubscribe();
    };

    return unsubscribe;
  }, []);

  const connect = async () => {
    try {
      await walletClient.connectWallet();
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  };

  const disconnect = () => {
    walletClient.disconnectWallet();
  };

  const formattedAddress = walletInfo?.address
    ? `${walletInfo.address.slice(0, 6)}...${walletInfo.address.slice(-4)}`
    : null;

  return {
    state,
    walletInfo,
    error,
    connect,
    disconnect,
    isConnected: state === 'connected',
    isConnecting: state === 'connecting',
    formattedAddress,
  };
}
