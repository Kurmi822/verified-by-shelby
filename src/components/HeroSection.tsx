/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Filter, Sparkles } from "lucide-react";
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
  
  const totalVerified = projects.filter(p => p.isShelbyVerified).length;
  const categories = ["All", "DeFi", "NFT", "Infrastructure", "Gaming", "Social", "Tooling"];

  return (
    <div className="relative text-center max-w-3xl mx-auto py-8 md:py-12 px-4 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Soft elegant badge */}
      <div className="inline-flex items-center gap-1.5 bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/80 dark:border-indigo-900/40 px-3 py-1 rounded-full text-xs font-semibold tracking-tight shadow-2xs">
        <Sparkles className="h-3.5 w-3.5" />
        <span>ShelbyForge Devnet Portal</span>
      </div>

      {/* Headline & taglines */}
      <div className="space-y-3">
        <h1 className="font-display text-3xl sm:text-4.5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          Explore the <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent">Shelbynet Ecosystem</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Discover high-performance dApps and developer services verified instantly over the Shelbynet ledger. Search, filter, and register developer builds with cryptographic proofs.
        </p>
      </div>

      {/* Primary actions */}
      <div className="flex items-center justify-center gap-3.5 pt-1">
        <button
          onClick={openSubmitModal}
          className="py-2.5 px-5 bg-slate-950 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          Register dApp
        </button>
        <span className="text-xs text-slate-400 font-medium">
          • <span className="font-bold text-slate-700 dark:text-slate-350">{totalVerified}</span> Verified List Entries
        </span>
      </div>

      {/* Simplified Search & Filtering Console */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dApps by keyword or tag..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-colors"
            />
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800/80 p-1 rounded-xl bg-slate-50/50 dark:bg-slate-900/60 shrink-0">
            <Filter className="h-3 w-3 text-slate-400 ml-1.5" />
            <div className="flex gap-1">
              {[
                { id: "trending", label: "Trending" },
                { id: "latest", label: "Newest" },
                { id: "cost", label: "Lowest Fee" }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSortBy(pill.id as any)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    sortBy === pill.id
                      ? "bg-white text-slate-900 dark:bg-indigo-600 dark:text-white shadow-2xs"
                      : "text-slate-500 dark:text-slate-400 hover:bg-white/45 dark:hover:bg-slate-950"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sector filtering row */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white dark:bg-indigo-600 shadow-sm"
                    : "bg-slate-50/80 dark:bg-slate-900 text-slate-600 dark:text-slate-450 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat === "All" ? "All Categories" : cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
