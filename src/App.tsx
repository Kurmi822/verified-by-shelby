/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProjectCard from "./components/ProjectCard";
import SubmitModal from "./components/SubmitModal";
import { Project, WalletState } from "./types";
import { fetchShelbynetBalances } from "./lib/shelby-balances";
import { 
  Award, ShieldCheck, Database, HardDrive, Coins, ExternalLink, RefreshCw, 
  Layers, Filter, PlusCircle, ArrowRight, Compass, Info, CheckCircle2
} from "lucide-react";

// Premium high-fidelity presets for initial catalog display
const PRESET_PROJECTS: Project[] = [
  {
    id: "sb_0f78d4ea05ff8d8bdc813589c",
    name: "Aptos Oracle Alliance",
    description: "The premier decentralized oracle network delivering real-time, high-fidelity sub-second price feeds directly to smart contracts on Aptos. Designed with multi-validator consensus to empower high-performance DeFi portals, lending pools, and automated market makers.",
    logoUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&auto=format&fit=crop&q=60",
    bannerUrl: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=805&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=600"
    ],
    category: "Infrastructure",
    chains: ["Aptos Testnet", "Shelby Devnet"],
    websiteUrl: "https://oracle.aptos.xyz",
    twitterUrl: "https://x.com/AptosOracle",
    discordUrl: "https://discord.gg/AptosOracle",
    isShelbyVerified: true,
    shelbyBlobUrl: "https://devnet.shelby.xyz/blob/sb_0f78d4ea05ff8d8bdc813589c",
    shelbyProof: JSON.stringify({
      version: "1.0.0",
      signer: "0x3f5cde2a8b919...shelby_validator_01",
      epochsActive: [2410, 2411],
      merklePath: ["left_0x48bc297dbcaef4d33", "right_0x9f7c1c8928ed84"],
      stateRoot: "0x0f78d4ea05ff8bdc813589ce58b9f71c4c8928ed84ea05ff8d8bdc813589c1",
      consensusTimestamp: "2026-05-25T12:45:00Z"
    }, null, 2),
    susdCost: 0.174,
    byteSize: 492,
    submittedAt: "2026-05-24T12:00:00Z"
  },
  {
    id: "sb_1bc89a8e58b9f71c4c8928ed8",
    name: "MoveLink Guard",
    description: "A secure threshold multi-signature treasury toolbox engineered for professional teams in the Move ecosystem. Allows organizations to lock operating capital, establish granular custom spending rules, and track team expenses with precise on-chain audit reports.",
    logoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=60",
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=805&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?w=600"
    ],
    category: "Tooling",
    chains: ["Aptos Testnet"],
    websiteUrl: "https://movelink.guard.io",
    twitterUrl: "https://x.com/MoveLinkGuard",
    testnetLink: "https://testnet.movelink.guard.io",
    isShelbyVerified: true,
    shelbyBlobUrl: "https://devnet.shelby.xyz/blob/sb_1bc89a8e58b9f71c4c8928ed8",
    shelbyProof: JSON.stringify({
      version: "1.0.0",
      signer: "0x7a3fb92c109cf90...shelby_validator_02",
      epochsActive: [2410],
      merklePath: ["left_0x8b9f71c4c892", "right_0x9c48bc297dbc"],
      stateRoot: "0x1bc89a8e58b9f71c4c8928ed8e58b9f71c4c8928ed84ea05ff8d8bdc813589d31",
      consensusTimestamp: "2026-05-25T14:30:00Z"
    }, null, 2),
    susdCost: 0.198,
    byteSize: 984,
    submittedAt: "2026-05-25T01:15:00Z"
  },
  {
    id: "sb_e58b9f71c4c8928ed84ea05ff",
    name: "MemeWave Tip Engine",
    description: "The ultimate micro-tipping browser extension and widget library for creator platforms. Seamlessly integrates content monetization, allowing users to tip digital creators instantly with minimal network fees while supporting standard Move tokens.",
    logoUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=128&auto=format&fit=crop&q=60",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=805&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600"
    ],
    category: "Social",
    chains: ["Aptos Testnet", "Shelby Devnet"],
    websiteUrl: "https://memewave.social",
    twitterUrl: "https://x.com/MemeWaveTip",
    discordUrl: "https://discord.gg/MemeWave",
    isShelbyVerified: true,
    shelbyBlobUrl: "https://devnet.shelby.xyz/blob/sb_e58b9f71c4c8928ed84ea05ff",
    shelbyProof: JSON.stringify({
      version: "1.0.0",
      signer: "0x4caef4d33ebef8...shelby_validator_04",
      epochsActive: [2408, 2409, 2410],
      merklePath: ["left_0xe58b9f71c4c89", "right_0xbc297dbcaef"],
      stateRoot: "0xe58b9f71c4c8928ed84ea05ff84ea05ff8d8bdc813589c1ac5ff8d8bdc1a",
      consensusTimestamp: "2026-05-25T08:12:00Z"
    }, null, 2),
    susdCost: 0.211,
    byteSize: 1248,
    submittedAt: "2026-05-24T20:45:00Z"
  },
  {
    id: "sb_bc813589c8ed84ea05ff8d8bd",
    name: "ShellPass Tickets",
    description: "A modern, responsive ticket tokenization platform built to secure events. Seamlessly handles physical-to-digital admission passes using decentralized metadata tracking, ensuring genuine ownership and rapid QR validation checks at real-world event entries.",
    logoUrl: "https://images.unsplash.com/photo-1644016825114-1e58f00072ad?w=128&auto=format&fit=crop&q=60",
    bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=805&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=600"
    ],
    category: "NFT",
    chains: ["Aptos Testnet"],
    websiteUrl: "https://shellpass.net",
    twitterUrl: "https://x.com/ShellPassApp",
    testnetLink: "https://foyer.shellpass.net",
    isShelbyVerified: true,
    shelbyBlobUrl: "https://devnet.shelby.xyz/blob/sb_bc813589c8ed84ea05ff8d8bd",
    shelbyProof: JSON.stringify({
      version: "1.0.0",
      signer: "0xec80d82bdbcaef...shelby_validator_05",
      epochsActive: [2410, 2411],
      merklePath: ["left_0xbc813589c8", "right_0x9c48bc297"],
      stateRoot: "0xbc813589c8ed84ea05ff8d8bde58b9f71c4c8928ed84ea05ff8d8bdc813589c31",
      consensusTimestamp: "2026-05-25T15:10:00Z"
    }, null, 2),
    susdCost: 0.162,
    byteSize: 242,
    submittedAt: "2026-05-25T16:05:00Z"
  }
];

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"discover" | "submit" | "my-projects">("discover");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"trending" | "latest" | "cost">("trending");

  // Wallet State
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    publicKey: null,
    isConnected: false,
    aptBalance: 0,
    susdBalance: 0,
    network: "Shelbynet (Devnet)",
  });

  // Project List (Preset + Custom uploaded from Local Storage)
  const [projects, setProjects] = useState<Project[]>(PRESET_PROJECTS);

  // Hydrate custom submitted projects and wallet settings from localStorage on load
  useEffect(() => {
    // Keep default light mode initially, but support manual shifts
    setDarkMode(false);

    // Load custom projects
    const savedProjects = localStorage.getItem("shelby_custom_projects");
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects) as Project[];
        setProjects([...PRESET_PROJECTS, ...parsed]);
      } catch (err) {
        console.error("Failed to parse custom projects", err);
      }
    }
  }, []);

  // Update wallet balances based on address change and handle auto-refresh periodically
  useEffect(() => {
    if (!wallet.isConnected || !wallet.address) return;

    const loadBalances = async () => {
      try {
        const { apt, susd } = await fetchShelbynetBalances(wallet.address!);
        setWallet(w => {
          if (w.aptBalance !== apt || w.susdBalance !== susd) {
            console.log("Auto-Refreshed Shelbynet Balances successfully:", { apt, susd });
            return {
              ...w,
              aptBalance: apt,
              susdBalance: susd,
              network: "Shelbynet (Devnet)"
            };
          }
          return w;
        });
      } catch (e) {
        console.error("Failed loading Shelbynet balances in hook:", e);
      }
    };

    loadBalances();

    // Auto-refresh balances every 8 seconds for a rapid, responsive experience
    const intervalId = setInterval(loadBalances, 8000);

    return () => clearInterval(intervalId);
  }, [wallet.isConnected, wallet.address, wallet.network]);

  // Handle addition of a newly submitted project
  const handleProjectSubmitted = (newProject: Project) => {
    // Append to list
    const currentCustom = localStorage.getItem("shelby_custom_projects");
    let updatedCustom: Project[] = [];
    if (currentCustom) {
      try {
        updatedCustom = JSON.parse(currentCustom);
      } catch (e) {
        updatedCustom = [];
      }
    }
    updatedCustom.push(newProject);
    localStorage.setItem("shelby_custom_projects", JSON.stringify(updatedCustom));

    setProjects(prev => [...prev, newProject]);
    setIsSubmitModalOpen(false);
    
    // Switch to index views to see submitted item
    setActiveTab("discover");
  };

  // Live Refresh Handler
  const handleRefreshBalances = async () => {
    if (!wallet.address) return;
    setIsRefreshing(true);

    try {
      const { apt, susd } = await fetchShelbynetBalances(wallet.address);
      setWallet(prev => ({
        ...prev,
        aptBalance: apt,
        susdBalance: susd,
        network: "Shelbynet (Devnet)"
      }));
    } catch (err) {
      console.warn("Failed refreshing live Shelbynet block metadata:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Search filter and sort pipelines
  const filteredProjects = projects.filter((project) => {
    // 1. Category Filter
    if (selectedCategory !== "All" && project.category !== selectedCategory) {
      return false;
    }

    // 2. Tab Filter
    if (activeTab === "my-projects") {
      // My Projects behaves by showing projects that was uploaded by the connected address.
      // Since mock or preset projects aren't uploaded, we verify id matches user submissions.
      // Custom submitted items we stowed locally can be easily selected.
      const userUploads = localStorage.getItem("shelby_custom_projects");
      if (userUploads) {
        try {
          const parsed = JSON.parse(userUploads) as Project[];
          return parsed.some(p => p.id === project.id);
        } catch {
          return false;
        }
      }
      return false; // None submitted yet trigger blank state
    }

    // 3. Text Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const inTitle = project.name.toLowerCase().includes(q);
      const inDesc = project.description.toLowerCase().includes(q);
      const inCategory = project.category.toLowerCase().includes(q);
      const inChain = project.chains.some(c => c.toLowerCase().includes(q));
      return inTitle || inDesc || inCategory || inChain;
    }

    return true;
  });

  // Sorting
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    }
    if (sortBy === "cost") {
      return (a.susdCost || 0) - (b.susdCost || 0);
    }
    // "trending" (default order based on categories & name lengths)
    return b.name.length - a.name.length;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col justify-between">
      
      {/* Upper Navigation Hub */}
      <div>
        <Header 
          wallet={wallet} 
          setWallet={setWallet}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openSubmitModal={() => setIsSubmitModalOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onRefreshBalances={handleRefreshBalances}
          isRefreshing={isRefreshing}
        />

        {/* Action Panel and Main Section content */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Main Discover Hub tab view */}
          {activeTab === "discover" && (
            <>
              {/* High-fidelity custom hero statistics catalog */}
              <HeroSection 
                projects={projects}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                openSubmitModal={() => setIsSubmitModalOpen(true)}
              />

              {/* Grid content displaying items */}
              {sortedProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-950/20 max-w-lg mx-auto">
                  <Compass className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No project listings found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Try adjusting your category filter, clearing your search query, or submit the very first one!
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="mt-4 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold text-slate-650 transition-colors cursor-pointer dark:text-slate-200"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* User's Own Uploads list */}
          {activeTab === "my-projects" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">My Registered dApps</h2>
                <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                  Manage dApp profiles registered under your connected wallet signer address on the Shelbynet ecosystem.
                </p>
              </div>

              {sortedProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-950/20 max-w-lg mx-auto">
                  <Database className="h-12 w-12 text-slate-400 mx-auto mb-3 animate-pulse" />
                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No registered listings</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    You have not submitted any directory listings with your active wallet signer address yet.
                  </p>
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="mt-4 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Register Your dApp
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Trust Badge Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-900 bg-white dark:bg-slate-950/50 py-6 transition-colors duration-350 shrink-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              ShelbyForge Ecosystem Hub • Live on Shelbynet Devnet
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://aptosnetwork.com" target="_blank" rel="noreferrer" className="hover:text-slate-600 dark:hover:text-slate-200 transition-all font-mono">
              Aptos Network
            </a>
            <span className="text-slate-200 dark:text-slate-800">|</span>
            <a href="https://shelby.xyz/governance" className="hover:text-slate-600 dark:hover:text-slate-200 transition-all font-mono">
              Shelby Governance
            </a>
          </div>
        </div>
      </footer>

      {/* Global Interactive Upload submit project modal */}
      <SubmitModal 
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        wallet={wallet}
        setWallet={setWallet}
        onProjectSubmitted={handleProjectSubmitted}
      />

    </div>
  );
}

