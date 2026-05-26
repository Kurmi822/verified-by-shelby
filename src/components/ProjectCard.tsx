/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Project 
} from "../types";
import { 
  ExternalLink, Twitter, Compass, Globe, Award, ShieldCheck, 
  ChevronRight, Calendar, Brain, Code, FileText, Share2, Layers
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  key?: React.Key | string;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copiedProof, setCopiedProof] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  // Quick category color theme mapping
  const categoryThemes: Record<string, { bg: string, text: string, border: string }> = {
    DeFi: { bg: "bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-500/20" },
    NFT: { bg: "bg-pink-500/10", text: "text-pink-700 dark:text-pink-400", border: "border-pink-500/20" },
    Infrastructure: { bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", border: "border-blue-500/20" },
    Gaming: { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-500/20" },
    Social: { bg: "bg-purple-500/10", text: "text-purple-700 dark:text-purple-400", border: "border-purple-500/20" },
    Tooling: { bg: "bg-cyan-500/10", text: "text-cyan-700 dark:text-cyan-400", border: "border-cyan-500/20" },
  };

  const theme = categoryThemes[project.category] || categoryThemes.DeFi;

  const handleCopyProof = () => {
    if (project.shelbyProof) {
      navigator.clipboard.writeText(project.shelbyProof);
      setCopiedProof(true);
      setTimeout(() => setCopiedProof(false), 2000);
    }
  };

  // Human friendly submitted date formatter
  const formattedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsDetailOpen(true)}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-950 p-5 dark:border-slate-800/80 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer h-full"
      >
        {/* Subtle blur decoration in the card */}
        <div className="absolute top-0 right-0 -mr-6 -mt-6 h-16 w-16 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/15 duration-200"></div>

        <div>
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3">
              <img 
                src={project.logoUrl || "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=128"} 
                alt={`${project.name} Logo`} 
                className="h-11 w-11 rounded-xl object-cover bg-slate-50 border border-slate-100 dark:border-slate-800/80 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-sans text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {project.name}
                </h3>
                {/* Category & Verified Badge */}
                <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md border ${theme.bg} ${theme.text} ${theme.border} block w-fit mt-1`}>
                  {project.category}
                </span>
              </div>
            </div>

            {/* Premium Shelby badge */}
            {project.isShelbyVerified && (
              <div 
                className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow-sm font-sans"
                title="Shelby Verified & Active Listing"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                VERIFIED
              </div>
            )}
          </div>

          {/* Description summary */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Target networks */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.chains.map((chain, i) => (
              <span key={i} className="text-[10px] font-mono bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 px-2 py-0.5 rounded text-slate-500">
                {chain}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer row */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900/60 pt-3.5 mt-2">
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
              Fee: <span className="font-mono font-bold text-slate-705 dark:text-slate-300">${project.susdCost?.toFixed(3) || "0.00"} SUSD</span>
            </span>
          </div>
          <span className="flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 duration-200">
            View Details
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>

      </div>

      {/* Modern Detail View Drawer/Modal Overlay */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm dark:bg-black/70 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 overflow-y-auto max-h-[92vh] scrollbar-styled">
            
            {/* Header / Accent top strip */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500"></div>

            {/* Actions header row */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-900">
              <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-indigo-500" />
                dApp Profile ID: {project.id}
              </span>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="p-1 px-2 text-xs bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg border border-slate-200/50 dark:border-slate-800 transition-colors cursor-pointer"
              >
                Close (Esc)
              </button>
            </div>

            {/* Profile info block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3.5">
                <img 
                  src={project.logoUrl || "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=128"} 
                  alt={project.name} 
                  className="h-16 w-16 rounded-2xl object-cover bg-slate-50 shadow border border-slate-100 dark:border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{project.name}</h1>
                    {project.isShelbyVerified && (
                      <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        VERIFIED dAPP
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md border ${theme.bg} ${theme.text} ${theme.border}`}>
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      Listed: {formattedDate(project.submittedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Call to Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {project.testnetLink && (
                  <a
                    href={project.testnetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    Launch App
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-705 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-805 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Official Link
                  <Globe className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Banner block if exists, otherwise clean display */}
            {project.bannerUrl && (
              <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 border border-slate-200 dark:border-slate-800 shadow-inner">
                <img 
                  src={project.bannerUrl} 
                  alt={`${project.name} Banner`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e)=>{
                    // Fallback banner
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800';
                  }}
                />
              </div>
            )}

            {/* Body Description */}
            <div className="space-y-4 mb-5">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Project Specification</h4>
              <p className="text-sm text-slate-600 dark:text-slate-450 leading-relaxed bg-slate-50/50 dark:bg-slate-900/20 p-4 rounded-xl border border-slate-100 dark:border-slate-900">
                {project.description}
              </p>
            </div>

            {/* Collapsible Technical Metadata & Audit */}
            <div className="border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden mb-5">
              <button 
                type="button"
                onClick={() => setShowTechnical(!showTechnical)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 transition-colors text-left border-none cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  Technical Registration Record
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
                  {showTechnical ? "Hide Stats ✕" : "Show On-Chain Details +"}
                </span>
              </button>
              
              {showTechnical && (
                <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-850 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">Registration Fee Paid</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">${project.susdCost?.toFixed(4) || "0.150"} SUSD</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">Metadata Record Size</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{project.byteSize ? `${(project.byteSize / 1024).toFixed(3)} KB` : "1.2 KB"}</span>
                    </div>
                  </div>

                  {project.shelbyBlobUrl && (
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">On-Chain Registrar URI</span>
                      <a href={project.shelbyBlobUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline inline-flex items-center gap-1.5 font-mono break-all mt-0.5">
                        {project.shelbyBlobUrl}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </div>
                  )}

                  {project.shelbyProof && (
                    <div className="pt-2">
                       <div className="flex items-center justify-between mb-1.5">
                         <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold">
                           Consensus Node Signer Proof
                         </span>
                         <button
                           onClick={handleCopyProof}
                           className="text-[10px] font-semibold text-indigo-500 hover:underline cursor-pointer"
                         >
                           {copiedProof ? "Copied!" : "Copy Proof JSON"}
                         </button>
                       </div>
                       <pre className="text-[9px] font-mono leading-relaxed bg-slate-50 dark:bg-slate-900/90 p-3 rounded-lg text-slate-500 dark:text-slate-400 overflow-x-auto max-h-36 scrollbar-styled border border-slate-100 dark:border-slate-900/80">
                         {project.shelbyProof}
                       </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Social media connections footer list */}
            <div className="flex flex-wrap items-center justify-between gap-4 dark:border-slate-900 border-t border-slate-100 pt-3.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[10px] uppercase tracking-wide">Developer Channels:</span>
                <div className="flex flex-wrap items-center gap-2.5 ml-1">
                  {project.twitterUrl && (
                    <a href={project.twitterUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                      <Twitter className="h-3.5 w-3.5" />
                      Twitter
                    </a>
                  )}
                  {project.discordUrl && (
                    <a href={project.discordUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                      <Share2 className="h-3.5 w-3.5" />
                      Discord
                  </a>
                  )}
                  {project.telegramUrl && (
                    <a href={project.telegramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                      <FileText className="h-3.5 w-3.5" />
                      Telegram
                    </a>
                  )}
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">Epoch Verified ✔</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
