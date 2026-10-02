'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Key, Lock, ArrowRight, Building, Check } from 'lucide-react';

interface ExecutivePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquire: () => void;
}

export default function ExecutivePortalModal({
  isOpen,
  onClose,
  onInquire,
}: ExecutivePortalModalProps) {
  const [memberId, setMemberId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberId.trim().length >= 3) {
      setAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Please input a valid Member ID or Corporate Access Identifier.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#002069] px-6 py-4 flex items-center justify-between text-white border-b-2 border-[#bb0013]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-[#bb0013] rounded-xs" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Executive Member Portal</h3>
              <p className="text-[11px] text-slate-300">Confidential Directory Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {authenticated ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[#002069]">Portal Access Verified</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Welcome back to Edge India Executive Network. You have privileged clearance to view closed-circuit syndicate notes, bilateral trade briefs, and direct leadership contacts.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-left text-xs space-y-1.5 text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-[#002069]">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Active Membership Tier: Institutional Fellow
                </div>
                <p>• Next Board Session: Oct 28, 2026 (Taj Palace, New Delhi)</p>
                <p>• Private Working Group: Advanced Mobility & Logistics</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[#12358f] hover:bg-[#002069] text-white text-xs font-bold rounded transition-colors"
              >
                Enter Executive Workspace
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-xs text-slate-600">
                Enter your institutional membership credentials or request clearance from the Secretariat.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Member ID or Official Email
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="e.g. EIBG-FELLOW-2026"
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#12358f]/20 focus:border-[#12358f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Security Passcode / Token
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#12358f]/20 focus:border-[#12358f]"
                  />
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#12358f] hover:bg-[#002069] text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                Authenticate Clearance
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onInquire();
                  }}
                  className="text-xs text-[#12358f] hover:text-[#002069] font-bold"
                >
                  Not yet a member? Request Corporate Nomination →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
