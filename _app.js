import "../styles/globals.css";
import { WalletProvider } from "../components/wallet-provider";
import { NotificationProvider } from "../components/notification-toast";
import { NotificationWatcher } from "../components/notification-watcher";
import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';
import Head from 'next/head';

/**
 * Main App Component
 * Wraps all pages with providers for Celo blockchain integration and notifications
 * NotificationWatcher polls for new notifications and displays them
 */
export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize the MiniApp SDK
    const initMiniApp = async () => {
      await sdk.actions.ready();
    };
    initMiniApp();
  }, []);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <WalletProvider>
        <NotificationProvider>
          <NotificationWatcher />
          <Component {...pageProps} />
        </NotificationProvider>
      </WalletProvider>
    </>
  );
}
