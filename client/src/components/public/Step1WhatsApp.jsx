import React from 'react';
import { Star, Check, MessageSquare, ArrowRight } from 'lucide-react';

const SATISFACTION_OPTIONS = [
  { score: 1, label: 'Very dissatisfied', emoji: '😞' },
  { score: 2, label: 'Dissatisfied', emoji: '🙁' },
  { score: 3, label: 'Neutral', emoji: '😐' },
  { score: 4, label: 'Satisfied', emoji: '😊' },
  { score: 5, label: 'Very satisfied', emoji: '😍' },
];

const LIKES_OPTIONS = [
  'Easy to use',
  'Familiar',
  'Quick communication',
  'Can directly contact Papido',
  'Convenient',
  'Easy to send booking details',
];

const DIFFICULTIES_OPTIONS = [
  'Waiting for confirmation',
  'Messages can get missed',
  'Difficult to know booking status',
  'No proper booking history',
  'Have to manually send booking details',
  'Difficult during busy periods',
  'No major problems',
];

export default function Step1WhatsApp({ formData, updateFormData, onNext }) {
  const {
    whatsapp_satisfaction,
    whatsapp_likes = [],
    whatsapp_likes_other = '',
    whatsapp_difficulties = [],
    whatsapp_difficulties_other = '',
  } = formData;

  const toggleLike = (item) => {
    const exists = whatsapp_likes.includes(item);
    const updated = exists
      ? whatsapp_likes.filter((i) => i !== item)
      : [...whatsapp_likes, item];
    updateFormData({ whatsapp_likes: updated });
  };

  const toggleDifficulty = (item) => {
    const exists = whatsapp_difficulties.includes(item);
    let updated;
    if (item === 'No major problems') {
      // If clicking 'No major problems', clear other difficulties
      updated = exists ? [] : ['No major problems'];
    } else {
      updated = exists
        ? whatsapp_difficulties.filter((i) => i !== item)
        : [...whatsapp_difficulties.filter((i) => i !== 'No major problems'), item];
    }
    updateFormData({ whatsapp_difficulties: updated });
  };

  const hasLikesOther = whatsapp_likes.includes('Other');
  const hasDiffOther = whatsapp_difficulties.includes('Other');

  const isValid = whatsapp_satisfaction >= 1 && whatsapp_satisfaction <= 5;

  return (
    <div className="max-w-xl mx-auto px-4 space-y-8 animate-fade-in-up">
      {/* Current baseline banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-xs flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            How do you currently book Papido rides?
          </span>
          <p className="text-sm font-bold text-slate-800 mt-0.5">
            💬 Primarily through WhatsApp chat
          </p>
        </div>
      </div>

      {/* Q1: WhatsApp Satisfaction */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              How satisfied are you with the current WhatsApp booking experience?
            </h2>
            <p className="text-xs text-slate-500 mt-1">Select the rating that best matches your experience.</p>
          </div>
          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Required</span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-2">
          {SATISFACTION_OPTIONS.map((opt) => {
            const isSelected = whatsapp_satisfaction === opt.score;
            return (
              <button
                type="button"
                key={opt.score}
                onClick={() => updateFormData({ whatsapp_satisfaction: opt.score })}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 shadow-sm scale-[1.03]'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1.5">{opt.emoji}</span>
                <span className="text-xs font-black text-slate-800">{opt.score}</span>
                <span className="text-[10px] sm:text-[11px] text-center font-medium text-slate-500 line-clamp-1 leading-tight mt-0.5">
                  {opt.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {whatsapp_satisfaction && (
          <div className="text-center pt-1 text-xs font-semibold text-amber-800">
            Selected: {SATISFACTION_OPTIONS.find((o) => o.score === whatsapp_satisfaction)?.label} ({whatsapp_satisfaction} / 5)
          </div>
        )}
      </div>

      {/* Q2: What do you like about WhatsApp */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            What do you like about WhatsApp booking?
          </h2>
          <p className="text-xs text-slate-500 mt-1">Select all that apply.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {LIKES_OPTIONS.map((item) => {
            const isChecked = whatsapp_likes.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggleLike(item)}
                className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isChecked
                    ? 'border-emerald-500 bg-emerald-50/60 font-semibold text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs sm:text-sm">{item}</span>
              </button>
            );
          })}

          {/* Other option */}
          <button
            type="button"
            onClick={() => toggleLike('Other')}
            className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
              hasLikesOther
                ? 'border-emerald-500 bg-emerald-50/60 font-semibold text-slate-900 shadow-xs'
                : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
                hasLikesOther
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {hasLikesOther && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-xs sm:text-sm">Other</span>
          </button>
        </div>

        {hasLikesOther && (
          <div className="pt-2">
            <input
              type="text"
              placeholder="Please describe what else you like about WhatsApp..."
              value={whatsapp_likes_other}
              onChange={(e) => updateFormData({ whatsapp_likes_other: e.target.value })}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        )}
      </div>

      {/* Q3: What difficulties do you face with WhatsApp booking? */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            What difficulties do you face with WhatsApp booking?
          </h2>
          <p className="text-xs text-slate-500 mt-1">Select all that apply. (Survey is strictly neutral)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {DIFFICULTIES_OPTIONS.map((item) => {
            const isChecked = whatsapp_difficulties.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggleDifficulty(item)}
                className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isChecked
                    ? 'border-amber-500 bg-amber-50/60 font-semibold text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
                    isChecked
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs sm:text-sm">{item}</span>
              </button>
            );
          })}

          {/* Other option */}
          <button
            type="button"
            onClick={() => toggleDifficulty('Other')}
            className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
              hasDiffOther
                ? 'border-amber-500 bg-amber-50/60 font-semibold text-slate-900 shadow-xs'
                : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
                hasDiffOther
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {hasDiffOther && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-xs sm:text-sm">Other</span>
          </button>
        </div>

        {hasDiffOther && (
          <div className="pt-2">
            <input
              type="text"
              placeholder="Please describe any other difficulty faced..."
              value={whatsapp_difficulties_other}
              onChange={(e) => updateFormData({ whatsapp_difficulties_other: e.target.value })}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          disabled={!isValid}
          onClick={onNext}
          className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            isValid
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Continue to Step 2</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
