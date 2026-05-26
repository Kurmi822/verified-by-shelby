/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  X, Check, Sparkles, Brain, Code, FileCode, CheckCircle2, 
  HelpCircle, AlertCircle, Coins, ArrowRight, ExternalLink, RefreshCw, FileText
} from "lucide-react";
import { Project, WalletState } from "../types";
import { shelby } from "../lib/shelby-sdk";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  setWallet: React.Dispatch<React.SetStateAction<WalletState>>;
  onProjectSubmitted: (project: Project) => void;
}

const PRESETS = [
  {
    name: "Aptos Prime DEX",
    description: "Next-generation concentrated liquidity market maker and limit order-book protocol natively constructed on the Aptos Testnet layer-1 framework, optimizing storage fees using Shelby devnet blobs.",
    logoUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=128&auto=format&fit=crop&q=60",
    bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=805&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=600&auto=format&fit=crop&q=60"
    ],
    category: "DeFi",
    chains: ["Aptos Testnet", "Shelby Devnet"],
    websiteUrl: "https://prime.aptos.xyz",
    twitterUrl: "https://x.com/AptosPrimeDex",
    discordUrl: "https://discord.gg/AptosPrime",
    telegramUrl: "https://t.me/AptosPrimeAnn",
    testnetLink: "https://testnet.prime.aptos.xyz"
  },
  {
    name: "AptoQuest RPG",
    description: "A complete decentralized retro role-playing game where item metadata and hero character stats are committed permanently as zero-knowledge verifiable Shelby Blobs to prevent item duplication.",
    logoUrl: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=128&auto=format&fit=crop&q=60",
    bannerUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=805&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60"
    ],
    category: "Gaming",
    chains: ["Aptos Testnet"],
    websiteUrl: "https://aptoquest.io",
    twitterUrl: "https://x.com/AptoQuestGame",
    discordUrl: "https://discord.gg/AptoQuest",
    telegramUrl: "https://t.me/AptoQuestPlayer",
    testnetLink: "https://play.aptoquest.io"
  }
];

export default function SubmitModal({
  isOpen,
  onClose,
  wallet,
  setWallet,
  onProjectSubmitted,
}: SubmitModalProps) {
  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [newScreenshot, setNewScreenshot] = useState("");
  const [category, setCategory] = useState<"DeFi" | "NFT" | "Infrastructure" | "Gaming" | "Social" | "Tooling">("DeFi");
  const [chains, setChains] = useState<string[]>(["Aptos Testnet"]);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [testnetLink, setTestnetLink] = useState("");

  // States
  const [jsonSize, setJsonSize] = useState(0);
  const [costInSUSD, setCostInSUSD] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadStatusMsg, setUploadStatusMsg] = useState("");
  const [uploadReceipt, setUploadReceipt] = useState<any | null>(null);
  const [hasSufficientSUSD, setHasSufficientSUSD] = useState(true);

  // Prefill helper
  const handlePrefill = (index: number) => {
    const preset = PRESETS[index];
    setName(preset.name);
    setDescription(preset.description);
    setLogoUrl(preset.logoUrl);
    setBannerUrl(preset.bannerUrl);
    setScreenshots(preset.screenshots);
    setCategory(preset.category as any);
    setChains(preset.chains);
    setWebsiteUrl(preset.websiteUrl);
    setTwitterUrl(preset.twitterUrl || "");
    setDiscordUrl(preset.discordUrl || "");
    setTelegramUrl(preset.telegramUrl || "");
    setTestnetLink(preset.testnetLink || "");
  };

  // Compile JSON data & calculate byte size
  useEffect(() => {
    const formPayload = {
      name,
      description,
      logoUrl,
      bannerUrl,
      screenshots,
      category,
      chains,
      socials: { websiteUrl, twitterUrl, discordUrl, telegramUrl, testnetLink },
      timestamp: new Date().toISOString()
    };
    
    const stringified = JSON.stringify(formPayload);
    const size = new Blob([stringified]).size;
    setJsonSize(size);
    
    // Estimate cost in Shelby USD
    const cost = shelby.estimateUploadCost(size);
    setCostInSUSD(cost);
    
    // Check if wallet has enough
    if (wallet.isConnected) {
      setHasSufficientSUSD(wallet.susdBalance >= cost);
    } else {
      setHasSufficientSUSD(true);
    }
  }, [name, description, logoUrl, bannerUrl, screenshots, category, chains, websiteUrl, twitterUrl, discordUrl, telegramUrl, testnetLink, wallet.susdBalance, wallet.isConnected]);

  // Handle screenshots adding
  const addScreenshot = () => {
    if (newScreenshot.trim()) {
      setScreenshots([...screenshots, newScreenshot.trim()]);
      setNewScreenshot("");
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  // Submit flow matching strict specifications
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) {
      alert("Please connect your wallet in the header before attempting submission!");
      return;
    }

    if (!hasSufficientSUSD) {
      alert(`Insufficient Shelby USD! Connection balance: $${wallet.susdBalance.toFixed(4)} SUSD. Cost estimated: $${costInSUSD.toFixed(4)} SUSD. Use faucet to mint more.`);
      return;
    }

    setIsUploading(true);
    setUploadStep(1);
    setUploadStatusMsg("Analyzing project metadata schema & verifying fields...");

    try {
      // Step 2: Preparing Payload & Signer validation
      await new Promise(resolve => setTimeout(resolve, 800));
      setUploadStep(2);
      setUploadStatusMsg("Calculating cryptographic payload hashes & preparing Shelby Merkle Leaf...");

      // Step 3: Simulation consensus storage
      await new Promise(resolve => setTimeout(resolve, 850));
      setUploadStep(3);
      setUploadStatusMsg("Broadcasting transaction blocks to Shelby Devnet epoch consensus...");

      const payload = {
        name,
        description,
        logoUrl,
        bannerUrl,
        screenshots,
        category,
        chains,
        socials: { websiteUrl, twitterUrl, discordUrl, telegramUrl, testnetLink }
      };

      // Call high-fidelity upload module which verifies funds are valid
      const receipt = await shelby.uploadBlob(
        wallet.address!,
        name,
        payload,
        wallet.susdBalance
      );

      // Deduct balance and update wallet
      const originalBalance = wallet.susdBalance;
      const remains = originalBalance - receipt.susdCost;
      localStorage.setItem(`susd_${wallet.address}`, remains.toFixed(4));
      
      setWallet(prev => ({
        ...prev,
        susdBalance: remains
      }));

      // Create product project item with real verified details
      const newSubmittedProject: Project = {
        id: receipt.blobId,
        name,
        description,
        logoUrl: logoUrl || "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=128&auto=format&fit=crop&q=60",
        bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=805&auto=format&fit=crop&q=80",
        screenshots: screenshots.length > 0 ? screenshots : ["https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=600", "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?w=600"],
        category,
        chains,
        websiteUrl,
        twitterUrl,
        discordUrl,
        telegramUrl,
        testnetLink,
        isShelbyVerified: true,
        shelbyBlobUrl: receipt.blobUrl,
        shelbyProof: receipt.cryptographicProof,
        susdCost: receipt.susdCost,
        byteSize: receipt.byteSize,
        submittedAt: receipt.timestamp
      };

      // Step 4: Stashing final state
      await new Promise(resolve => setTimeout(resolve, 800));
      setUploadStep(4);
      setUploadStatusMsg(`Upload complete. Deducted $${receipt.susdCost.toFixed(4)} Shelby USD (SUSD) successfully.`);
      setUploadReceipt(newSubmittedProject);
      
      // Bubble up to main screen
      onProjectSubmitted(newSubmittedProject);

    } catch (err: any) {
      console.error(err);
      alert(`Consensus upload rejected: ${err.message || err}`);
      setIsUploading(false);
      setUploadStep(0);
    }
  };

  // Reset form and close
  const handleResetAndClose = () => {
    setName("");
    setDescription("");
    setLogoUrl("");
    setBannerUrl("");
    setScreenshots([]);
    setNewScreenshot("");
    setCategory("DeFi");
    setChains(["Aptos Testnet"]);
    setWebsiteUrl("");
    setTwitterUrl("");
    setDiscordUrl("");
    setTelegramUrl("");
    setTestnetLink("");
    setUploadReceipt(null);
    setUploadStep(0);
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm dark:bg-black/70 flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden transition-all max-h-[92vh] flex flex-col justify-between">
        
        {/* Neon light effect in header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-10 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              Register dApp on Shelbynet
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Submit your decentralized application details to the Shelbynet community directory.
            </p>
          </div>
          <button 
            onClick={isUploading ? undefined : onClose}
            className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 active:scale-95 duration-100 disabled:opacity-40"
            disabled={isUploading && uploadStep < 4}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body with scroll */}
        <div className="flex-1 overflow-y-auto px-1 scrollbar-styled pr-3">
          
          {/* Active Uploading / Success stepper screen overlay */}
          {isUploading ? (
            <div className="py-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              
              {uploadStep < 4 ? (
                /* Loading State */
                <div className="space-y-6 max-w-md">
                  <div className="relative flex items-center justify-center h-20 w-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
                    <FileCode className="h-8 w-8 text-indigo-500 animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Registering on Shelbynet</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{uploadStatusMsg}</p>
                  </div>

                  {/* Stepper progress indicator */}
                  <div className="pt-4 grid grid-cols-3 gap-2 text-xs font-medium">
                    <div className={`p-2 rounded-lg border transition-all ${uploadStep >= 1 ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                      1. Check Balance
                    </div>
                    <div className={`p-2 rounded-lg border transition-all ${uploadStep >= 2 ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                      2. Ledger Sign
                    </div>
                    <div className={`p-2 rounded-lg border transition-all ${uploadStep >= 3 ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"}`}>
                      3. Registry Broadcast
                    </div>
                  </div>
                </div>
              ) : (
                /* Success Receipt screen */
                <div className="space-y-6 w-full max-w-2xl text-left">
                  <div className="flex items-center gap-4.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl p-4 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                      <CheckCircle2 className="h-6.5 w-6.5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">dApp Listing Registered Successfully!</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Your Web3 project entry has been broadcasted and verified on the Shelbynet Directory ledger.</p>
                    </div>
                  </div>

                  {/* Shelby Receipt Fields */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] tracking-wider text-slate-400 dark:text-slate-500 font-mono uppercase block">SUSD Listing Fee</span>
                        <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">${uploadReceipt?.susdCost?.toFixed(4)} SUSD</span>
                      </div>
                      <div>
                        <span className="text-[10px] tracking-wider text-slate-400 dark:text-slate-500 font-mono uppercase block">Registry Entry Size</span>
                        <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{(uploadReceipt?.byteSize / 1024).toFixed(3)} KB</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[10px] tracking-wider text-slate-400 dark:text-slate-500 font-mono uppercase block">On-Chain Registry URI</span>
                        <a 
                          href={uploadReceipt?.shelbyBlobUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="font-mono text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1.5 mt-0.5 break-all"
                        >
                          {uploadReceipt?.shelbyBlobUrl}
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                    </div>

                    {/* Cryptographic Merkle Merged proof panel */}
                    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
                      <span className="text-[10px] tracking-wider text-slate-400 dark:text-slate-500 font-mono uppercase block mb-1.5 font-bold flex items-center gap-1">
                        <Brain className="h-3.5 w-3.5 text-indigo-500" />
                        Directory ledger record proof
                      </span>
                      <pre className="font-mono text-[10px] overflow-x-auto text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 max-h-40 scrollbar-styled leading-relaxed">
                        {uploadReceipt?.shelbyProof}
                      </pre>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={handleResetAndClose}
                      className="w-full sm:w-auto py-2.5 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Return to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Submission Form Content */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Shelby Presets Quick Selection */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 mb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-2.5">
                  ⚡ Instantly pre-fill the form with a demo listing preset:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePrefill(idx)}
                      className="text-xs font-semibold py-1.5 px-3.5 bg-white dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 rounded-xl transition-all cursor-pointer"
                    >
                      Prefill &quot;{preset.name}&quot;
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid 1: Basic Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shelby Finance"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5 font-semibold">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="DeFi">DeFi (Decentralized Finance)</option>
                    <option value="NFT">NFT & Creative Art</option>
                    <option value="Infrastructure">Infrastructure & Nodes</option>
                    <option value="Gaming">Gaming & Metaverse</option>
                    <option value="Social">SocialFi & Messaging</option>
                    <option value="Tooling">Developer Tooling</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Project Description & Utility *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what your web3 project does, how it utilizes the Shelby network, and its direct end-user benefit..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-colors"
                />
              </div>

              {/* UI Graphics Link (Logo & Banner) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Project Logo URL</label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-colors"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Transparent PNG is optimal. Prefilling supports direct stock images.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Banner Image URL</label>
                  <input
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://example.com/banner.jpg"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-colors"
                  />
                </div>
              </div>

              {/* Screenshots Array Box */}
              <div className="border border-slate-150 dark:border-slate-900 rounded-2xl p-4 bg-slate-50/40 dark:bg-slate-950/20">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2.5">Verified Screenshots</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={newScreenshot}
                    onChange={(e) => setNewScreenshot(e.target.value)}
                    placeholder="https://example.com/screenshot1.jpg"
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={addScreenshot}
                    className="py-2.5 px-4 bg-slate-800 dark:bg-indigo-950 hover:bg-slate-705 dark:hover:bg-indigo-900 border border-slate-200 dark:border-indigo-900 text-slate-800 dark:text-indigo-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Add Link
                  </button>
                </div>

                {screenshots.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {screenshots.map((shot, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-mono border border-slate-200 dark:border-slate-700">
                        <span className="truncate max-w-[180px] text-slate-600 dark:text-slate-400">{shot}</span>
                        <button
                          type="button"
                          onClick={() => removeScreenshot(idx)}
                          className="text-rose-500 hover:text-rose-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chains Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Target Deployment Networks</label>
                <div className="flex flex-wrap gap-4">
                  {["Aptos Testnet", "Aptos Mainnet", "Shelbynet (Devnet)"].map((networkName) => {
                    const isChecked = chains.includes(networkName);
                    return (
                      <label key={networkName} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setChains(chains.filter(c => c !== networkName));
                            } else {
                              setChains([...chains, networkName]);
                            }
                          }}
                          className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                        />
                        {networkName}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Grid 2: Social & Website URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-900 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Official Website URL *</label>
                  <input
                    type="url"
                    required
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://mycoolproject.io"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Live dApp / Testnet URL</label>
                  <input
                    type="url"
                    value={testnetLink}
                    onChange={(e) => setTestnetLink(e.target.value)}
                    placeholder="https://testnet.mycoolproject.io"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">X (Twitter) URL</label>
                  <input
                    type="url"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://x.com/mycoolproject"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Discord Community Link</label>
                  <input
                    type="url"
                    value={discordUrl}
                    onChange={(e) => setDiscordUrl(e.target.value)}
                    placeholder="https://discord.gg/invitelink"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-colors"
                  />
                </div>
              </div>

              {/* Bottom Row Estimator and Submit */}
              <div className="border-t border-slate-100 dark:border-slate-900 pt-4 mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                             {/* Cost Estimator Panel */}
                <div className="flex items-center gap-3 bg-indigo-500/10 dark:bg-indigo-950/20 hover:bg-indigo-500/15 border border-indigo-500/20 rounded-2xl py-2.5 px-4 max-w-md shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shrink-0">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-indigo-700 dark:text-indigo-400 font-mono font-bold uppercase tracking-wider">
                      Directory registration estimate
                    </span>
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-300 block">
                      Estimated Size: <span className="font-bold text-slate-805 dark:text-slate-100">{(jsonSize / 1024).toFixed(3)} KB</span> • Total SUSD: <span className="font-bold text-indigo-605 dark:text-indigo-405 font-mono">${costInSUSD.toFixed(4)}</span>
                    </span>
                  </div>
                </div>

                {/* Submit action */}
                <div className="flex items-center gap-3 justify-end">
                  {!wallet.isConnected ? (
                    <div className="text-right">
                      <span className="text-[11px] text-rose-500 font-medium block">Wallet disconnected.</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Connect via Header before registering!</span>
                    </div>
                  ) : !hasSufficientSUSD ? (
                    <div className="text-right">
                      <span className="text-[11px] text-amber-500 font-semibold block">Insufficient Shelby USD.</span>
                      <span className="text-[10px] text-slate-405 block">Requires: ${costInSUSD.toFixed(4)} SUSD.</span>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={!wallet.isConnected || !hasSufficientSUSD || !name || !description || !websiteUrl}
                    className="py-2.5 px-7 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 flex items-center gap-2"
                  >
                    Register dApp
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
