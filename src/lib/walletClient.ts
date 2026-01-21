// Web3 Wallet Client Stub
// TODO: Integrate with actual provider (e.g., Privy, RainbowKit, Web3Modal)

export type WalletState = 'idle' | 'connecting' | 'connected' | 'error';

export interface WalletInfo {
  address: string;
  chainId: number;
  chainName: string;
}

export interface WalletClient {
  state: WalletState;
  walletInfo: WalletInfo | null;
  error: string | null;
  
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getWalletAddress: () => string | null;
}

/**
 * Stub implementation of WalletClient
 * This is a placeholder for the actual Web3 integration
 * 
 * TODO: Replace with actual Web3 provider integration
 * Recommended providers:
 * - Privy (https://privy.io) - Best for non-crypto-native users
 * - RainbowKit (https://rainbowkit.com) - Beautiful wallet connection
 * - Web3Modal (https://web3modal.com) - WalletConnect's official modal
 */
class WalletClientStub implements WalletClient {
  state: WalletState = 'idle';
  walletInfo: WalletInfo | null = null;
  error: string | null = null;
  
  private listeners: Set<() => void> = new Set();
  
  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  
  private notify() {
    this.listeners.forEach(cb => cb());
  }
  
  async connectWallet(): Promise<void> {
    // TODO: Implement actual wallet connection
    // Example with Privy:
    // await privy.login();
    // const address = privy.user?.wallet?.address;
    
    this.state = 'connecting';
    this.error = null;
    this.notify();
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful connection (for demo purposes)
    // In production, this would be replaced with actual wallet connection
    const mockAddress = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    this.walletInfo = {
      address: mockAddress,
      chainId: 137, // Polygon
      chainName: 'Polygon',
    };
    this.state = 'connected';
    this.notify();
  }
  
  disconnectWallet(): void {
    // TODO: Implement actual wallet disconnection
    this.state = 'idle';
    this.walletInfo = null;
    this.error = null;
    this.notify();
  }
  
  getWalletAddress(): string | null {
    return this.walletInfo?.address ?? null;
  }
  
  /**
   * Simulate an error state (for testing UI)
   */
  simulateError(message: string): void {
    this.state = 'error';
    this.error = message;
    this.walletInfo = null;
    this.notify();
  }
}

// Singleton instance
export const walletClient = new WalletClientStub();

/**
 * Format wallet address for display
 * e.g., 0x1234...5678
 */
export function formatWalletAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
