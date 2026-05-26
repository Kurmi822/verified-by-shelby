import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Buffer } from "buffer";

// Buffer and global polyfill for wallet adapter standard compatibility
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
  (window as any).global = window;
}

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AptosWalletAdapterProvider optInWallets={["Petra"]} autoConnect={true}>
      <App />
    </AptosWalletAdapterProvider>
  </StrictMode>,
);

