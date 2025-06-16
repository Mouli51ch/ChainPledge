'use client';

import React from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <AptosWalletAdapterProvider autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
} 