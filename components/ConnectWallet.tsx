'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useEffect } from 'react';

export function ConnectWallet() {
  const { connected, connect, disconnect, account, wallets } = useWallet();

  useEffect(() => {
    console.log('=== CONNECT WALLET DEBUG ===');
    console.log('ConnectWallet component mounted');
    console.log('Wallet state:', { connected, account, wallets });
    console.log('Available wallets:', wallets);
    console.log('Wallets length:', wallets?.length);
    console.log('Petra extension detected:', typeof window !== 'undefined' && !!window.aptos);
    
    if (wallets && wallets.length > 0) {
      wallets.forEach((wallet, index) => {
        console.log(`Wallet ${index}:`, {
          name: wallet.name,
          readyState: wallet.readyState,
          url: wallet.url,
          icon: wallet.icon
        });
      });
    } else {
      console.log('No wallets available');
    }
  }, [connected, account, wallets]);

  const handleConnect = async () => {
    console.log('=== CONNECT ATTEMPT ===');
    console.log('Connect button clicked');
    console.log('Current wallet state:', { connected, account, wallets });
    
    // First, try direct connection to Petra
    if (typeof window !== 'undefined' && window.aptos) {
      console.log('Testing direct Petra connection...');
      try {
        const directResponse = await window.aptos.connect();
        console.log('Direct Petra connection successful:', directResponse);
      } catch (directError) {
        console.error('Direct Petra connection failed:', directError);
      }
    }
    
    try {
      console.log('Calling wallet adapter connect()...');
      await connect();
      console.log('Wallet adapter connect() completed successfully');
    } catch (error) {
      console.error('Wallet adapter connect failed:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      alert('Failed to connect wallet: ' + error.message);
    }
  };

  const handleDisconnect = async () => {
    console.log('=== DISCONNECT ATTEMPT ===');
    try {
      await disconnect();
      console.log('Disconnect completed successfully');
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  return (
    <div>
      {!connected ? (
        <Button variant="outline" onClick={handleConnect}>
          Connect Wallet
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
          <p className="text-sm">Connected: {account?.address?.toString().slice(0, 6)}...{account?.address?.toString().slice(-4)}</p>
          <Button variant="outline" onClick={handleDisconnect}>Disconnect</Button>
        </div>
      )}
    </div>
  );
} 