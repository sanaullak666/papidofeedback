import React from 'react';
import { ShieldCheck, MessageSquare, ExternalLink } from 'lucide-react';

export default function Header({ currentStep, onReset, newBookingUrl }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onReset && onReset(0)}>
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-amber-400/40 bg-amber-50 flex items-center justify-center">
            <img
              src="/papidologo.jpeg"
              alt="Papido Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="font-extrabold text-amber-600 text-lg">P</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xl tracking-tight text-slate-900 font-sans">PAPIDO</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                Official Survey
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Your Opinion Matters</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {newBookingUrl && (
            <a
              href={newBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span>Explore Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          
          <a
            href="/admin/login"
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-2 py-1 rounded transition-colors"
            title="Admin Login"
          >
            Admin
          </a>
        </div>
      </div>
    </header>
  );
}
