import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer({ onOpenPrivacy }) {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-500">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-1">
          <span>© {new Date().getFullYear()} Papido Technologies.</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenPrivacy}
            className="hover:text-slate-800 transition-colors underline cursor-pointer flex items-center space-x-1"
          >
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Privacy Notice</span>
          </button>
          
          <a
            href="https://www.papido.online"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-800 transition-colors"
          >
            papido.online
          </a>
        </div>
      </div>
    </footer>
  );
}
