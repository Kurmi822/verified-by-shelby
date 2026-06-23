/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Project } from "../types";
import { 
  ExternalLink, Twitter, Globe, Award, ShieldCheck, 
  ChevronRight, Calendar, Share2, FileText, Layers
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  key?: React.Key | string;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copiedProof, setCopiedProof] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  // Clean, high-contrast flat category tags
  const categoryThemes: Record<string, { bg: string; text: string; border: string }> = {
    DeFi: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
    NFT: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
    Infrastructure: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
    Gaming: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
    Social: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
    Tooling: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
  };

  const theme = categoryThemes[project.category] || categoryThemes.DeFi;

  const handleCopyProof = () => {
    if (project.shelbyProof) {
      navigator.clipboard.writeText(project.shelbyProof);
      setCopiedProof(true);
      setTimeout(() => setCopiedProof(false), 2000);
    }
  };

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
      {/* Pristine Clean Minimalist Card */}
      <div 
        onClick={() => setIsDetailOpen(true)}
        className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white dark:bg-slate-950 p-5 dark:border-slate-800 hover:border-indigo-500 hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/5 dark:hover:shadow-transparent transition-all duration-300 ease-out cursor-pointer h-full"
      >
        <div>
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <img 
                src={project.logoUrl || "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=128"} 
                alt={`${project.name} Logo`} 
                className="h-10 w-10 rounded-lg object-cover bg-slate-50 border border-slate-200 dark:border-slate-800 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {project.name}
                </h3>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mt-0.5">
                  {project.category}
                </span>
              </div>
            </div>

            {project.isShelbyVerified && (
              <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 px-2 py-0.5 rounded text-[10px] font-bold">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>

          {/* Clean simplified description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {project.description}
          </p>

          {/* Minimal networks list */}
          <div className="flex flex-wrap gap-1">
            {project.chains.map((chain, i) => (
              <span key={i} className="text-[9px] font-mono bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                {chain}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900/65 pt-3 mt-3.5">
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Fee Paid: <span className="font-mono font-semibold text-slate-700 dark:text-slate-350">${project.susdCost?.toFixed(3) || "0.00"}</span>
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Details
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>

      {/* Simplified, Clean Modal Detail Box */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60 flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl p-5 sm:p-6 overflow-y-auto max-h-[90vh] scrollbar-styled">
            
            {/* Minimal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-900">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                ID: {project.id}
              </span>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            {/* Logo, Name, Category */}
            <div className="flex items-center gap-3.5 mb-4">
              <img 
                src={project.logoUrl || "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=128"} 
                alt={project.name} 
                className="h-14 w-14 rounded-xl object-cover bg-slate-50 border border-slate-200 dark:border-slate-800"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">{project.name}</h2>
                  {project.isShelbyVerified && (
                    <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-2">
                  <span>{project.category}</span>
                  <span>•</span>
                  <span>Listed {formattedDate(project.submittedAt)}</span>
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="flex gap-2 mb-4">
              {project.testnetLink && (
                <a
                  href={project.testnetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
                >
                  Launch dApp
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                Website
                <Globe className="h-3 w-3" />
              </a>
            </div>

            {/* Beautiful, clean description */}
            <div className="mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900">
                {project.description}
              </p>
            </div>

            {/* Collapsible Technical info to prevent page clutter */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-4">
              <button 
                type="button"
                onClick={() => setShowTechnical(!showTechnical)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors text-left text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <span>Technical Specifications</span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                  {showTechnical ? "Hide ✕" : "Show Details +"}
                </span>
              </button>
              
              {showTechnical && (
                <div className="p-3.5 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">Fee Paid</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">${project.susdCost?.toFixed(4) || "0.150"} SUSD</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">Registry Size</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{project.byteSize ? `${(project.byteSize / 1024).toFixed(3)} KB` : "1.2 KB"}</span>
                    </div>
                  </div>

                  {project.shelbyBlobUrl && (
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">On-Chain Registrar URI</span>
                      <a href={project.shelbyBlobUrl} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline inline-flex items-center gap-1 font-mono break-all mt-0.5">
                        {project.shelbyBlobUrl}
                        <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                      </a>
                    </div>
                  )}

                  {project.shelbyProof && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">
                          Ledger Proof Signature
                        </span>
                        <button
                          onClick={handleCopyProof}
                          className="text-[10px] font-bold text-indigo-500 hover:underline cursor-pointer"
                        >
                          {copiedProof ? "Copied!" : "Copy JSON"}
                        </button>
                      </div>
                      <pre className="text-[9px] font-mono leading-relaxed bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded text-slate-500 dark:text-slate-400 overflow-x-auto max-h-24 border border-slate-100 dark:border-slate-900">
                        {project.shelbyProof}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Social channels footer */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-3 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                {project.twitterUrl && (
                  <a href={project.twitterUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-500 flex items-center gap-1">
                    Twitter
                  </a>
                )}
                {project.discordUrl && (
                  <a href={project.discordUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-500 flex items-center gap-1">
                    Discord
                  </a>
                )}
                {project.telegramUrl && (
                  <a href={project.telegramUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-500 flex items-center gap-1">
                    Telegram
                  </a>
                )}
              </div>
              <span className="text-[10px] font-mono">Devnet Status: Live</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
