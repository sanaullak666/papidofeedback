import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, Check, ExternalLink, RotateCcw, Heart, Share2 } from 'lucide-react';

export default function ThankYouPage({ feedbackRef, onReset, newBookingUrl }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.6 },
        zIndex: 9999,
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#F59E0B', '#10B981', '#3B82F6'],
      });
      fire(0.2, {
        spread: 60,
        colors: ['#F59E0B', '#FBBF24', '#D97706'],
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } catch (err) {
      // Graceful fallback if canvas is restricted
    }
  }, []);

  const handleCopyRef = () => {
    if (feedbackRef) {
      navigator.clipboard.writeText(feedbackRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-center space-y-6 animate-fade-in-up">
      {/* Animated badge */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30">
          <Heart className="w-10 h-10 fill-current text-white animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Feedback Recorded Successfully</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          💙 Thank You!
        </h1>

        <p className="text-base sm:text-lg font-semibold text-slate-800">
          Your opinion has been successfully submitted.
        </p>

        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your feedback will help Papido understand what users want before introducing the new booking experience.
        </p>
      </div>

      {/* Unique Reference Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm max-w-md mx-auto space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Your Official Feedback Reference
        </span>

        <div className="flex items-center justify-center space-x-3 bg-slate-50 py-3 px-4 rounded-xl border border-slate-200/80 font-mono text-lg sm:text-xl font-black text-slate-900 tracking-wider">
          <span>{feedbackRef || 'PAP-FB-RECORDED'}</span>
          <button
            onClick={handleCopyRef}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Copy Reference"
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Keep this reference if you would like to track or reference your response with Papido support.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Submit Another Response</span>
        </button>

        {newBookingUrl && (
          <a
            href={newBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            <span>Visit Papido</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
