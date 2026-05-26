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
        Explore and Discover Shelbynet Ecosystem dApps
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Side: Callouts and description */}
        <div className="lg:col-span-7 space-y-4">
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 leading-tight">
            The Hub for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Shelbynet Developers
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            ShelbyForge compiles production-ready decentralised applications, custom tools, and ecosystem innovations built on the Shelbynet custom framework. Connect your Petra wallet to discover verified products, explore web3 modules, or register your own creation.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={openSubmitModal}
              className="py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-md shadow-indigo-500/10 transition-all cursor-pointer animate-none"
            >
              Register Your dApp
            </button>
            <a
              href="https://shelby.xyz"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-1.5 transition-all"
            >
              Shelbynet Website
              <Layers className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Right Side: Sleek Stats Panel */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 shrink-0">
          
          {/* Statistic 1: Verified Catalog */}
          <div className="p-4 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-xs hover:border-indigo-500/20 transition-all duration-200 group">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Ecosystem dApps
              </span>
            </div>
            <div className="font-mono text-xl font-extrabold text-slate-800 dark:text-slate-100 group-hover:scale-[1.02] transition-transform">
              {totalVerified} Verified
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">Active community portals</span>
          </div>

          {/* Statistic 2: Collective entries */}
          <div className="p-4 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-xs hover:border-indigo-500/20 transition-all duration-200 group">
            <div className="flex items-center gap-2 mb-1.5">
              <HardDrive className="h-4 w-4 text-indigo-500" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Directory Hub
              </span>
            </div>
            <div className="font-mono text-xl font-extrabold text-slate-800 dark:text-slate-100 group-hover:scale-[1.02] transition-transform">
              {projects.length} Entries
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">Total submissions curated</span>
          </div>

          {/* Statistic 3: Registration Fee Cost */}
          <div className="p-4 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-xs hover:border-indigo-500/20 transition-all duration-200 group">
            <div className="flex items-center gap-2 mb-1.5">
              <Activity className="h-4 w-4 text-pink-500" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Listing Token
              </span>
            </div>
            <div className="font-mono text-xl font-extrabold text-indigo-600 dark:text-indigo-400 group-hover:scale-[1.02] transition-transform">
              ShelbyUSD
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">Faucets available in header</span>
          </div>

          {/* Statistic 4: Active Network Status */}
          <div className="p-4 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-xs hover:border-indigo-500/20 transition-all duration-200 group">
            <div className="flex items-center gap-2 mb-1.5">
              <Server className="h-4 w-4 text-cyan-500" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Network Status
              </span>
            </div>
            <div className="font-mono text-xl font-extrabold text-slate-800 dark:text-slate-100 group-hover:scale-[1.02] transition-transform">
              Devnet Online
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">1.2s avg. block time</span>
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
              placeholder="Search ShelbyForge dApps by title, description or tag..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-11 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-colors shadow-xs"
            />
          </div>

          {/* Sorting filter pill */}
          <div className="flex items-center gap-2 border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 p-1 rounded-xl self-end md:self-auto shrink-0">
            <Filter className="h-3.5 w-3.5 text-slate-400 ml-2" />
            <div className="flex gap-1">
              {[
                { id: "trending", label: "Trending" },
                { id: "latest", label: "Newest" },
                { id: "cost", label: "Lowest Fee" }
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
