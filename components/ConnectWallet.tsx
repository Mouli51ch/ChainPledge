'use client';

import { Button } from '@/components/ui/button';
import { useWallet, WalletReadyState } from '@aptos-labs/wallet-adapter-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ConnectWallet() {
  const { wallets, connected, disconnect, connect, account } = useWallet();

  // Debug logging
  console.log('Wallet state:', { connected, account, wallets: wallets.length });

  const availableWallets = wallets.filter(
    (wallet) =>
      wallet.readyState === WalletReadyState.Installed ||
      wallet.readyState === WalletReadyState.Loadable
  );

  const formatAddress = (address: any) => {
    if (!address) return 'Unknown';
    if (typeof address === 'string') return `${address.slice(0, 6)}...${address.slice(-4)}`;
    if (typeof address.toString === 'function') {
      const addrStr = address.toString();
      if (typeof addrStr === 'string') return `${addrStr.slice(0, 6)}...${addrStr.slice(-4)}`;
    }
    return 'Unknown';
  };

  return (
    <div>
      {!connected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Connect Wallet</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {availableWallets.map((wallet) => (
              <DropdownMenuItem key={wallet.name} onClick={() => connect(wallet.name)}>
                {wallet.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center space-x-2">
          <p className="text-sm">Connected: {formatAddress(account?.address)}</p>
          <Button variant="outline" onClick={disconnect}>Disconnect</Button>
        </div>
      )}
    </div>
  );
} 