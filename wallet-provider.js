"use client";

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Create query client for React Query
const queryClient = new QueryClient();

// Configuration for development vs production
const isProduction = process.env.NODE_ENV === 'production';

// RainbowKit/Wagmi config for Ethereum
const config = getDefaultConfig({
  appName: 'LeftAI',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [mainnet, sepolia],
  ssr: true, // Enable SSR for Next.js
});

/**
 * WalletProvider Component
 * Provides wallet connection and chain configuration for Ethereum network
 * Uses RainbowKit for wallet UI and Wagmi for blockchain interactions
 */
export function WalletProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
