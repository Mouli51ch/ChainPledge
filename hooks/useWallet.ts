'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wallet } from '@aptos-labs/wallet-adapter-react';
import { AptosWalletAdapter, Network } from '@aptos-labs/wallet-adapter-ant-design';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  wallet: Wallet | null;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    wallet: null,
  });

  const connect = useCallback(async (selectedWallet: Wallet) => {
    try {
      await selectedWallet.connect();
      const account = await selectedWallet.account();
      setWalletState({
        address: account.address,
        isConnected: true,
        wallet: selectedWallet,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletState({ address: null, isConnected: false, wallet: null });
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (walletState.wallet) {
      try {
        await walletState.wallet.disconnect();
        setWalletState({ address: null, isConnected: false, wallet: null });
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
      }
    }
  }, [walletState.wallet]);

  useEffect(() => {
    // This effect can be used to re-connect if the wallet is already connected
    // For simplicity, we're not implementing auto-reconnect here, but it's a common pattern
    // You would typically listen for wallet events or check on mount.

    // Example: check if a wallet is already connected (pseudo-code)
    // const aptosWallet = new AptosWalletAdapter({ network: Network.DEVNET });
    // if (aptosWallet.connected) {
    //   aptosWallet.account().then(account => {
    //     setWalletState({
    //       address: account.address,
    //       isConnected: true,
    //       wallet: aptosWallet,
    //     });
    //   });
    // }

  }, []);

  return { ...walletState, connect, disconnect };
} 