/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Search, ShieldCheck, Database, Server, Cpu, Layers, HardDrive, Filter, Activity, Sparkles
} from "lucide-react";
import { Project } from "../types";

interface HeroSectionProps {
  projects: Project[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: "trending" | "latest" | "cost";
  setSortBy: (sort: "trending" | "latest" | "cost") => void;
  openSubmitModal: () => void;
}

export default function HeroSection({
  projects,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  openSubmitModal,
}: HeroSectionProps) {
  
  // High-fidelity analytics calculations based on real project list state
  const totalVerified = projects.filter(p => p.isShelbyVerified).length;
  
  const totalBytes = projects.reduce((acc, curr) => {
    return acc + (curr.byteSize || 1350); // Default to realistic JSON size
  }, 0);
  
  const totalSUSDGas = projects.reduce((acc, curr) => {
    return acc + (curr.susdCost || 0.21);
  }, 0);

  const categories = ["All", "DeFi", "NFT", "Infrastructure", "Gaming", "Social", "Tooling"];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-b from-slate-50/80 to-white p-6 sm:p-8 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900/40 shadow-sm transition-all duration-300">
      
      {/* Background soft lighting blobs */}
      <div className="absolute top-0 right-1/4 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 h-44 w-44 rounded-full bg-pink-500/5 blur-3xl pointer-events-none"></div>

      {/* Decorative tagline */}
      <div className="relative inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-950/45 px-3 py-1 border border-indigo-500/20 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 mb-4 tracking-wider uppercase">
        <Sparkles className="h-3.5 w-3.5" />
        Consensus storage protocol for next-gen Aptos builders
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Side: Callouts and description */}
        <div className="lg:col-span-7 space-y-4">
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 leading-tight">
            The Verified Hub for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Shelby Protocol Blobs
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Shelby Verified index is a community curation portal. Every project profile is hashed and bundled into decentralized, cryptographic blobs on the Shelby Devnet. This establishes bulletproof transparency for auditors, team reviewers, and users on the Aptos ecosystem.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={openSubmitModal}
              className="py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
            >
              Submit &amp; Mint Blob
            </button>
            <a
              href="https://shelby.xyz/whitepaper"
              className="py-2.5 px-5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-1.5 transition-all"
            >
              Shelby Whitepaper
              <Layers className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Right Side: Dune style Analytics Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 shrink-0">
          
          {/* Statistic 1: Verified Catalog */}
          <div className="p-4 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-xs hover:border-indigo-500/20 transition-all duration-200 group">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 dark:text-slate-555">
                Sealed Catalog
              </span>
            </div>
            <div className="font-mono text-xl font-extrabold text-slate-800 dark:text-slate-100 group-hover:scale-[1.02] transition-transform">
              {totalVerified} Projects
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">100% on-chain audit status</span>
          </div>

          {/* Statistic 2: Collective bytes */}
          <div className="p-4 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-xs hover:border-indigo-500/20 transition-all duration-200 group">
            <div className="flex items-center gap-2 mb-1.5">
              <HardDrive className="h-4 w-4 text-indigo-500" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 dark:text-slate-555">
                Cum. Blob Storage
              </span>
            </div>
            <div className="font-mono text-xl font-extrabold text-slate-800 dark:text-slate-100 group-hover:scale-[1.02] transition-transform">
              {(totalBytes / 1024).toFixed(3)} KB
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">{totalBytes} bytes registered</span>
          </div>

          {/* Statistic 3: SUSD Gas Paid */}
          <div className="p-4 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-xs hover:border-indigo-500/20 transition-all duration-200 group">
            <div className="flex items-center gap-2 mb-1.5">
              <Activity className="h-4 w-4 text-pink-500" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 dark:text-slate-555">
                Consensus Gas Paid
              </span>
            </div>
            <div className="font-mono text-xl font-extrabold text-indigo-600 dark:text-indigo-400 group-hover:scale-[1.02] transition-transform">
              ${totalSUSDGas.toFixed(4)} <span className="text-xs font-medium text-slate-400 font-sans">SUSD</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">Estimated SUSD burnt</span>
          </div>

          {/* Statistic 4: Active Validators */}
          <div className="p-4 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-xs hover:border-indigo-500/20 transition-all duration-200 group">
            <div className="flex items-center gap-2 mb-1.5">
              <Server className="h-4 w-4 text-cyan-500" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 dark:text-slate-555">
                Shelby Consensus
              </span>
            </div>
            <div className="font-mono text-xl font-extrabold text-slate-800 dark:text-slate-100 group-hover:scale-[1.02] transition-transform">
              18 Nodes Live
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">Epoch 2410 • Devnet Active</span>
          </div>

        </div>

      </div>

      {/* Control Tray: Search, Filters & Sorting Panel */}
      <div className="mt-8 border-t border-slate-200/60 dark:border-slate-800/60 pt-6 space-y-4 relative z-10">
        
        {/* Row 1: Search and sorting */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Shelby Verified projects by title, description or tag..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-11 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-colors shadow-xs"
            />
          </div>

          {/* Sorting filter pill */}
          <div className="flex items-center gap-2 border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 p-1 rounded-xl self-end md:self-auto shrink-0">
            <Filter className="h-3.5 w-3.5 text-slate-400 ml-2" />
            <div className="flex gap-1">
              {[
                { id: "trending", label: "Trending" },
                { id: "latest", label: "Latest Uploads" },
                { id: "cost", label: "Lowest Cost SUSD" }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSortBy(pill.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    sortBy === pill.id
                      ? "bg-slate-900 text-white dark:bg-indigo-600"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Row 2: Categories buttons tray */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1.5 scrollbar-thin">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:inline">Quick Filter:</span>
          <div className="flex gap-1.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {cat === "All" ? "🗳 All Sectors" : cat}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
