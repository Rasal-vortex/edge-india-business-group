'use client';

import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Shield, ArrowRight, Building, Award } from 'lucide-react';

interface ProspectusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestMembership: () => void;
}

export default function ProspectusModal({
  isOpen,
  onClose,
  onRequestMembership,
}: ProspectusModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#002069] px-6 py-4 flex items-center justify-between text-white border-b-2 border-[#bb0013]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#bb0013] rounded-xs" />
            <div>
              <h3 className="text-lg font-bold tracking-tight">Institutional Governance Prospectus</h3>
              <p className="text-xs text-slate-300">2026 Edition • Edge India Business Group Secretariat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="w-12 h-12 rounded-lg bg-[#12358f] flex items-center justify-center text-white shrink-0 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#bb0013] uppercase tracking-widest">
                Official Charter & Framework
              </span>
              <h4 className="text-lg font-bold text-[#002069]">
                Edge India Executive Charter 2026–2030
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Comprehensive 42-page brief detailing our governance constitution, industry working groups, bilateral trade missions, private syndicate frameworks, and vetting standards for institutional leaders.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#002069] mb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#bb0013]" />
                Institutional Standing
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Peer-governed council operating across 18 high-priority manufacturing, infrastructure, and technology sectors, fostering bilateral trust and investment integrity.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#002069] mb-2 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#12358f]" />
                Syndicate Allocation
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct access to curated consortium deal flow exceeding ₹1,200 Cr in cross-border ventures, greenfield factories, and sovereign-backed corridors.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Key Prospectus Chapters
            </h5>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Chapter I: The Decadal Indian Enterprise Landscape</span>
                <span className="text-slate-400">Pages 04–11</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Chapter II: Steering Governance & Working Committees</span>
                <span className="text-slate-400">Pages 12–19</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Chapter III: Bilateral Corridors (GCC, ASEAN, EMEA)</span>
                <span className="text-slate-400">Pages 20–29</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Chapter IV: Co-Investment Syndicates & Code of Ethics</span>
                <span className="text-slate-400">Pages 30–42</span>
              </div>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Prospectus Dispatched</p>
                <p className="text-emerald-700">
                  The executive prospectus (PDF / 8.4 MB) has been generated and queued for download.
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onRequestMembership();
              }}
              className="text-xs text-[#12358f] hover:text-[#002069] font-bold flex items-center gap-1"
            >
              Ready to submit nomination?
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#12358f] hover:bg-[#002069] text-white text-xs font-bold rounded shadow-sm transition-all disabled:opacity-70"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Preparing Document...' : 'Download Prospectus (PDF)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
