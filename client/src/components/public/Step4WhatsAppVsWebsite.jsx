import React from 'react';
import { ArrowLeft, ArrowRight, MessageCircle, Globe, RefreshCw, HelpCircle, CheckCircle } from 'lucide-react';

const PREFERENCE_CARDS = [
  {
    id: 'WhatsApp',
    title: 'WhatsApp',
    icon: MessageCircle,
    color: 'emerald',
    badge: '💬 Chat-First',
    description: 'Keep booking rides through direct messaging on WhatsApp with Papido coordinators.',
    benefits: ['Direct interaction', 'Familiar & zero learning curve', 'Quick text on the go'],
  },
  {
    id: 'Papido Website',
    title: 'Papido Website',
    icon: Globe,
    color: 'blue',
    badge: '🌐 Digital Platform',
    description: 'Book online with structured pickup/drop inputs, automatic confirmations, and clear details.',
    benefits: ['Structured booking flow', 'No waiting for reply', 'Clear booking records'],
  },
  {
    id: 'Both',
    title: 'Both Options',
    icon: RefreshCw,
    color: 'amber',
    badge: '🔄 Hybrid Flex',
    description: 'Offer both online website booking and WhatsApp chat depending on personal convenience.',
    benefits: ['Maximum flexibility', 'Choose based on situation', 'Direct support when needed'],
  },
];

export default function Step4WhatsAppVsWebsite({ formData, updateFormData, onNext, onBack }) {
  const {
    preferred_booking_method = '',
    website_adoption_intent = '',
    continue_whatsapp = '',
    both_convenience = '',
  } = formData;

  const isValid =
    preferred_booking_method !== '' &&
    website_adoption_intent !== '' &&
    continue_whatsapp !== '' &&
    both_convenience !== '';

  return (
    <div className="max-w-xl mx-auto px-4 space-y-8 animate-fade-in-up">
      {/* Visual Comparison Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Which booking experience do you prefer?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          We want your honest, unbiased choice between chat booking, the new website, or a hybrid of both.
        </p>
      </div>

      {/* Large Comparison Selection Cards */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Select Your Primary Preference <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-1 gap-3">
          {PREFERENCE_CARDS.map((card) => {
            const Icon = card.icon;
            const isSelected = preferred_booking_method === card.id;

            return (
              <div
                key={card.id}
                onClick={() => updateFormData({ preferred_booking_method: card.id })}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-400/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        card.id === 'WhatsApp'
                          ? 'bg-emerald-500 text-white'
                          : card.id === 'Papido Website'
                          ? 'bg-blue-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">{card.title}</h3>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {card.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{card.description}</p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 transition-colors ${
                      isSelected ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                  {card.benefits.map((b, i) => (
                    <span key={i} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* No Preference Option */}
          <button
            type="button"
            onClick={() => updateFormData({ preferred_booking_method: 'No preference' })}
            className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
              preferred_booking_method === 'No preference'
                ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-400'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            I have no strong preference / Happy with either
          </button>
        </div>
      </div>

      {/* Q2: If the new website is officially launched, would you use it to book Papido rides? */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-start justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            If the new website is officially launched, would you use it to book Papido rides?
          </h2>
          <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Required</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {['Definitely Yes', 'Probably Yes', 'Maybe', 'Probably Not', 'Definitely Not'].map((opt) => {
            const isSelected = website_adoption_intent === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => updateFormData({ website_adoption_intent: opt })}
                className={`py-2.5 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Q3: Should Papido continue WhatsApp booking after launching the website? */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-start justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Should Papido continue WhatsApp booking after launching the website?
          </h2>
          <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Required</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {[
            { value: 'Yes', label: 'Yes, keep full WhatsApp booking' },
            { value: 'No', label: 'No, move exclusively to website' },
            { value: 'Yes, but mainly for support', label: 'Yes, but mainly for customer support' },
            { value: 'Not sure', label: 'Not sure / Undecided' },
          ].map((item) => {
            const isSelected = continue_whatsapp === item.value;
            return (
              <button
                type="button"
                key={item.value}
                onClick={() => updateFormData({ continue_whatsapp: item.value })}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center space-x-2.5 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Q4: Would having both WhatsApp and website booking make Papido more convenient? */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-start justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Would having both WhatsApp and website booking make Papido more convenient?
          </h2>
          <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Required</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {['Definitely Yes', 'Probably Yes', 'Neutral', 'Probably No', 'Definitely Not'].map((opt) => {
            const isSelected = both_convenience === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => updateFormData({ both_convenience: opt })}
                className={`py-2.5 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-xs ring-1 ring-amber-500'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={!isValid}
          onClick={onNext}
          className={`inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            isValid
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Continue to Step 5</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
