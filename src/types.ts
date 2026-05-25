/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  screenshots: string[];
  category: "DeFi" | "NFT" | "Infrastructure" | "Gaming" | "Social" | "Tooling";
  chains: string[];
  websiteUrl: string;
  twitterUrl?: string;
  discordUrl?: string;
  telegramUrl?: string;
  testnetLink?: string;
  isShelbyVerified: boolean;
  shelbyBlobUrl?: string;
  shelbyProof?: string;
  susdCost?: number;
  submittedAt: string;
  byteSize?: number;
}

export interface WalletState {
  address: string | null;
  publicKey: string | null;
  isConnected: boolean;
  aptBalance: number; // APT balance (live from Shelbynet or testnet config, or simulated if sandbox)
  susdBalance: number; // Shelby USD balance (live from custom token contract or fallback)
  network: string; // The network name badge
}

export interface ShelbyBlobResponse {
  blobId: string;
  blobUrl: string;
  cryptographicProof: string;
  byteSize: number;
  susdCost: number;
  timestamp: string;
}
