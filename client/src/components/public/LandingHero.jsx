import React from 'react';
import { Clock, ShieldCheck, ArrowRight, ExternalLink, Sparkles, MessageCircle, Globe, AlertCircle } from 'lucide-react';

export default function LandingHero({ onStart, onExploreWebsite, newBookingUrl, surveyActive = true }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in-up">
      {/* Top Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs sm:text-sm font-semibold shadow-xs">
          <img
            src="/papidologo.jpeg"
            alt="Papido Logo"
            className="w-4 h-4 rounded-full object-cover shrink-0 border border-amber-400/60"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span>Papido Booking — Your Opinion Matters</span>
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Help Shape the Future of <span className="text-amber-600 underline decoration-amber-400 decoration-wavy decoration-2">Papido</span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto font-normal">
          Papido currently accepts ride bookings through <span className="font-semibold text-slate-800">WhatsApp</span>. We're working on a new online booking experience, and before we launch it, we want to know what you think.
        </p>
      </div>

      {/* Survey Paused Notice Banner */}
      {!surveyActive && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start space-x-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Survey Submissions Paused</span>
            <span>
              Papido is currently reviewing incoming feedback and has temporarily closed new survey submissions. You can still explore our new booking website below!
            </span>
          </div>
        </div>
      )}

      {/* Time & Privacy Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center space-x-1.5 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Approx. <strong>2–3 minutes</strong></span>
        </div>
        <div className="flex items-center space-x-1.5 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Anonymous & Neutral</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
        {surveyActive ? (
          <button
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 font-bold text-base shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Share Your Opinion</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-slate-200 text-slate-500 font-semibold text-sm cursor-not-allowed">
            <span>Submissions Currently Closed</span>
          </div>
        )}

        {newBookingUrl && (
          <button
            onClick={onExploreWebsite}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 font-semibold text-base shadow-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Explore New Booking Website</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Value Pillars Cards */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-slate-200">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Current WhatsApp</h2>
            <p className="text-xs text-slate-500 mt-0.5">Share what works and what's difficult with chat booking.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">New Booking Web</h2>
            <p className="text-xs text-slate-500 mt-0.5">Test the preview and tell us if it meets your needs.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Your Voice</h2>
            <p className="text-xs text-slate-500 mt-0.5">Decide whether Papido should launch, keep both, or wait.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
