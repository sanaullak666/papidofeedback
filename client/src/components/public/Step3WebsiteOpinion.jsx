import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const OPINION_OPTIONS = [
  { value: 'Excellent', label: 'Excellent', emoji: '🌟', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
  { value: 'Very Good', label: 'Very Good', emoji: '👍', color: 'border-blue-500 bg-blue-50 text-blue-900' },
  { value: 'Good', label: 'Good', emoji: '👌', color: 'border-amber-500 bg-amber-50 text-amber-900' },
  { value: 'Average', label: 'Average', emoji: '⚖️', color: 'border-slate-400 bg-slate-50 text-slate-800' },
  { value: 'Needs Improvement', label: 'Needs Improvement', emoji: '🛠️', color: 'border-orange-500 bg-orange-50 text-orange-900' },
];

const EASE_OPTIONS = [
  { value: 'Very Easy', label: 'Very Easy' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Difficult', label: 'Difficult' },
  { value: 'Very Difficult', label: 'Very Difficult' },
];

const LIKES_OPTIONS = [
  'Simple booking process',
  'Website design',
  'Easy navigation',
  'Booking information',
  'Speed',
  'Convenience',
];

export default function Step3WebsiteOpinion({ formData, updateFormData, onNext, onBack }) {
  const {
    website_opinion = '',
    website_ease_of_use = '',
    website_likes = [],
    website_likes_other = '',
    website_improvements = '',
  } = formData;

  const toggleLike = (item) => {
    const exists = website_likes.includes(item);
    const updated = exists
      ? website_likes.filter((i) => i !== item)
      : [...website_likes, item];
    updateFormData({ website_likes: updated });
  };

  const hasLikesOther = website_likes.includes('Other');
  const isValid = website_opinion !== '' && website_ease_of_use !== '';

  return (
    <div className="max-w-xl mx-auto px-4 space-y-7 animate-fade-in-up">
      {/* Q1: Overall opinion */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              After seeing the new Papido booking website, what is your overall opinion?
            </h2>
            <p className="text-xs text-slate-500 mt-1">Please provide your genuine perspective.</p>
          </div>
          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Required</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          {OPINION_OPTIONS.map((opt) => {
            const isSelected = website_opinion === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => updateFormData({ website_opinion: opt.value })}
                className={`flex items-center space-x-2.5 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? `${opt.color} font-bold shadow-xs scale-[1.02]`
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-xs sm:text-sm">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Q2: Ease of use */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              How easy do you think the new website is to use?
            </h2>
            <p className="text-xs text-slate-500 mt-1">From booking navigation to step completion.</p>
          </div>
          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Required</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {EASE_OPTIONS.map((opt) => {
            const isSelected = website_ease_of_use === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => updateFormData({ website_ease_of_use: opt.value })}
                className={`py-3 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Q3: What do you like about the new website */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            What do you like about the new website?
          </h2>
          <p className="text-xs text-slate-500 mt-1">Select all that apply.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {LIKES_OPTIONS.map((item) => {
            const isChecked = website_likes.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggleLike(item)}
                className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isChecked
                    ? 'border-blue-500 bg-blue-50/60 font-semibold text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
                    isChecked
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs sm:text-sm">{item}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => toggleLike('Other')}
            className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
              hasLikesOther
                ? 'border-blue-500 bg-blue-50/60 font-semibold text-slate-900 shadow-xs'
                : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
                hasLikesOther
                  ? 'bg-blue-600 border-blue-600 text-white'
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
              placeholder="What else caught your attention?"
              value={website_likes_other}
              onChange={(e) => updateFormData({ website_likes_other: e.target.value })}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        )}
      </div>

      {/* Q4: What should we improve before launch? */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            What should we improve before launch?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Any friction, confusing buttons, missing information, or visual suggestions.
          </p>
        </div>

        <textarea
          rows={3}
          placeholder="e.g. Make location selection easier, improve mobile loading speed, add more details..."
          value={website_improvements}
          onChange={(e) => updateFormData({ website_improvements: e.target.value })}
          className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/40"
        />
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
          <span>Continue to Step 4</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
