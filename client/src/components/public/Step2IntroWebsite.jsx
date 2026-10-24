import React from 'react';
import { ExternalLink, CheckCircle2, ArrowRight, ArrowLeft, Globe, Sparkles, Smartphone, Shield, CalendarCheck } from 'lucide-react';

export default function Step2IntroWebsite({ formData, updateFormData, onNext, onBack, newBookingUrl }) {
  const { explored_website = false } = formData;

  const handleOpenWebsite = () => {
    updateFormData({ explored_website: true });
    if (newBookingUrl) {
      window.open(newBookingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="max-w-xl mx-auto px-4 space-y-6 animate-fade-in-up">
      {/* Visual Information Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Under Development Preview</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight font-sans">
            A New Way to Book Papido
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Papido is preparing a dedicated online ride-booking website designed to make booking simpler and more structured.
          </p>

          <div className="pt-2 pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              What the new website is designed to provide:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { title: 'Online ride booking', icon: Smartphone },
                { title: 'Booking confirmation', icon: CheckCircle2 },
                { title: 'Booking details', icon: CalendarCheck },
                { title: 'Easier booking flow', icon: ArrowRight },
                { title: 'Better organization', icon: Shield },
                { title: 'Future digital features', icon: Globe },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs sm:text-sm text-slate-200 bg-white/5 p-2 rounded-lg border border-white/10">
                    <IconComponent className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/80 space-y-3">
            <button
              type="button"
              onClick={handleOpenWebsite}
              className="w-full inline-flex items-center justify-center space-x-2.5 px-6 py-4 rounded-xl text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Explore the New Papido Booking Website</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            {explored_website && (
              <div className="flex items-center justify-center space-x-2 text-xs text-emerald-400 pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Great! You've checked out the new preview.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continuation notice & navigation buttons */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <p className="text-xs sm:text-sm text-slate-600 text-center">
          Take a minute to browse the new booking flow, then share your honest thoughts on the next screen.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Step 1</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>I've explored the website → Continue Survey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
