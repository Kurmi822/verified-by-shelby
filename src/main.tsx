import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Buffer } from "buffer";

// Buffer and global polyfill for 2026 wallet adapter standard compatibility
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
  (window as any).global = window;
}

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { Network } from "@aptos-labs/ts-sdk";
import App from "./App.tsx";
import "./index.css";

const wallets = [new PetraWallet()];

// Configure dApp is pointing to Shelbynet Custom Network natively
const shelbyDappConfig = {
  network: Network.CUSTOM,
  aptosConfig: {
    network: Network.CUSTOM,
    fullnode: "https://api.shelbynet.shelby.xyz/v1",
    indexer: "https://api.shelbynet.shelby.xyz/v1/graphql"
  }
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AptosWalletAdapterProvider 
      plugins={wallets}
      optInWallets={["Petra"]} 
      autoConnect={true}
      dappConfig={shelbyDappConfig}
    >
      <App />
    </AptosWalletAdapterProvider>
  </StrictMode>,
);
