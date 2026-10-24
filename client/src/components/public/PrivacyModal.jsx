import React from 'react';
import { X, ShieldCheck, Lock, EyeOff } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in-up">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-lg">Papido Survey Privacy Notice</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium">
            “Your contact information is optional and will only be used if you request Papido to contact you regarding your feedback.”
          </div>

          <h4 className="font-bold text-slate-800 text-sm pt-1">1. Voluntary Participation</h4>
          <p>
            Participation in this opinion survey is 100% voluntary. You are free to complete the survey without providing your name, phone number, or email address.
          </p>

          <h4 className="font-bold text-slate-800 text-sm pt-1">2. Purpose of Data Collection</h4>
          <p>
            The collected ratings and suggestions are analyzed in aggregate to help Papido evaluate the existing WhatsApp ride booking experience and prioritize features for the upcoming online booking platform.
          </p>

          <h4 className="font-bold text-slate-800 text-sm pt-1">3. Data Protection & Non-Disclosure</h4>
          <p>
            Papido does not sell, lease, or distribute survey participant information to third parties or marketing advertisers. Any provided contact information is retained strictly for support follow-up if requested by you.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
}
