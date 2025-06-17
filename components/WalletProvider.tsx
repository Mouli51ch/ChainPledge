'use client';

import React, { useEffect, useMemo } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Wallet, WalletName, WalletReadyState } from '@aptos-labs/wallet-adapter-core';

// TypeScript declaration for Petra extension
declare global {
  interface Window {
    aptos?: {
      connect(): Promise<{ address: string; publicKey: string }>;
      disconnect(): Promise<void>;
      network(): Promise<{ name: string }>;
      signAndSubmitTransaction(transaction: any): Promise<{ hash: string }>;
      signMessage(message: any): Promise<any>;
      onAccountChange(callback: (account: any) => void): void;
      onNetworkChange(callback: (network: any) => void): void;
    };
  }
}

interface WalletProviderProps {
  children: React.ReactNode;
}

// Create a minimal Petra wallet implementation
const createPetraWallet = (): Wallet => {
  const name = 'Petra' as WalletName<'Petra'>;
  
  return {
    name,
    url: 'https://petra.app',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=',
    providerName: 'Petra',
    provider: typeof window !== 'undefined' ? window.aptos : undefined,
    readyState: typeof window !== 'undefined' && window.aptos ? WalletReadyState.Installed : WalletReadyState.NotDetected,
    
    async connect() {
      if (!this.provider) {
        throw new Error('Petra wallet not found');
      }
      const response = await this.provider.connect();
      return {
        address: response.address,
        publicKey: response.publicKey,
        minKeysRequired: 1,
        ansName: null,
      };
    },
    
    async disconnect() {
      if (this.provider) {
        await this.provider.disconnect();
      }
    },
    
    async network() {
      if (!this.provider) {
        throw new Error('Petra wallet not found');
      }
      const network = await this.provider.network();
      return network.name;
    },
    
    async signAndSubmitTransaction(transaction: any) {
      if (!this.provider) {
        throw new Error('Petra wallet not found');
      }
      const response = await this.provider.signAndSubmitTransaction(transaction);
      return {
        hash: response.hash,
      };
    },
    
    async signMessage(message: any) {
      if (!this.provider) {
        throw new Error('Petra wallet not found');
      }
      return await this.provider.signMessage(message);
    },
    
    async onAccountChange(callback: (account: any) => Promise<void>) {
      if (this.provider) {
        this.provider.onAccountChange(callback);
      }
    },
    
    async onNetworkChange(callback: (network: any) => Promise<void>) {
      if (this.provider) {
        this.provider.onNetworkChange(callback);
      }
    },
  };
};

export function WalletProvider({ children }: WalletProviderProps) {
  const plugins = useMemo(() => {
    if (typeof window === 'undefined') return [];
    return [createPetraWallet()];
  }, []);

  useEffect(() => {
    console.log('=== WALLET PROVIDER DEBUG ===');
    console.log('WalletProvider mounted');
    console.log('Plugins array:', plugins);
    console.log('Petra extension status:', typeof window !== 'undefined' && !!window.aptos);
    
    if (typeof window !== 'undefined') {
      if (window.aptos) {
        console.log('✅ Petra extension is available');
      } else {
        console.log('❌ Petra extension is NOT available');
      }
    }
  }, [plugins]);

  return (
    <AptosWalletAdapterProvider plugins={plugins} autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
} 