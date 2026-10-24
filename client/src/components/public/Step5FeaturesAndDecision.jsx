import React from 'react';
import { ArrowLeft, Check, Sparkles, Shield, User, Phone, Mail, Send, Loader2 } from 'lucide-react';

const FEATURE_OPTIONS = [
  'Booking confirmation',
  'Booking history',
  'Ride status',
  'Notifications',
  'Online payment',
  'Advance booking',
  'Cancellation option',
  'Easier passenger details',
  'Better booking information',
];

const DECISION_OPTIONS = [
  {
    value: 'Launch the new website alongside WhatsApp',
    shortVal: 'Launch alongside WhatsApp',
    badge: '🟢',
    title: 'Launch the new website alongside WhatsApp',
    desc: 'Keep WhatsApp fully active and open the new website so users have the freedom to choose either.',
    style: 'border-emerald-500 bg-emerald-50/60 text-slate-900 ring-2 ring-emerald-500/20',
  },
  {
    value: 'Move primarily to website booking',
    shortVal: 'Move primarily to website',
    badge: '🔵',
    title: 'Move primarily to website booking',
    desc: 'Shift the primary booking flow to the new website to standardize ride management.',
    style: 'border-blue-500 bg-blue-50/60 text-slate-900 ring-2 ring-blue-500/20',
  },
  {
    value: 'Launch the website after making improvements',
    shortVal: 'Launch after improvements',
    badge: '🟡',
    title: 'Launch the website after making improvements',
    desc: 'Address user feedback, polish the booking experience first, then roll it out.',
    style: 'border-amber-500 bg-amber-50/60 text-slate-900 ring-2 ring-amber-500/20',
  },
  {
    value: 'Continue with WhatsApp booking',
    shortVal: 'Continue with WhatsApp',
    badge: '🟣',
    title: 'Continue with WhatsApp booking',
    desc: 'Keep operating primarily via WhatsApp chat without rolling out a separate website.',
    style: 'border-purple-500 bg-purple-50/60 text-slate-900 ring-2 ring-purple-500/20',
  },
  {
    value: "I'm not sure",
    shortVal: 'Not sure',
    badge: '⚪',
    title: "I'm not sure",
    desc: 'Neutral or need to see more before recommending a final direction.',
    style: 'border-slate-400 bg-slate-100/80 text-slate-900 ring-2 ring-slate-400/20',
  },
];

export default function Step5FeaturesAndDecision({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  isSubmitting,
}) {
  const {
    requested_features = [],
    requested_features_other = '',
    most_important_improvement = '',
    launch_recommendation = '',
    additional_feedback = '',
    willing_to_contact = false,
    contact_name = '',
    contact_mobile = '',
    contact_email = '',
  } = formData;

  const toggleFeature = (item) => {
    const exists = requested_features.includes(item);
    const updated = exists
      ? requested_features.filter((i) => i !== item)
      : [...requested_features, item];
    updateFormData({ requested_features: updated });
  };

  const hasFeaturesOther = requested_features.includes('Other');

  // Launch recommendation is required
  const isValid = launch_recommendation !== '';

  return (
    <div className="max-w-xl mx-auto px-4 space-y-8 animate-fade-in-up">
      {/* Q1: Features wanted in new system */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            What features would you like to see in the new booking system?
          </h2>
          <p className="text-xs text-slate-500 mt-1">Select all features you consider valuable.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {FEATURE_OPTIONS.map((item) => {
            const isChecked = requested_features.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggleFeature(item)}
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

          <button
            type="button"
            onClick={() => toggleFeature('Other')}
            className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
              hasFeaturesOther
                ? 'border-amber-500 bg-amber-50/60 font-semibold text-slate-900 shadow-xs'
                : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
                hasFeaturesOther
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {hasFeaturesOther && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-xs sm:text-sm">Other</span>
          </button>
        </div>

        {hasFeaturesOther && (
          <div className="pt-2">
            <input
              type="text"
              placeholder="What other feature would you love to see?"
              value={requested_features_other}
              onChange={(e) => updateFormData({ requested_features_other: e.target.value })}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>
        )}
      </div>

      {/* Q2: Most important thing to improve */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            What is the most important thing Papido should improve in the booking experience?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Focus on speed, accuracy, driver communications, or price transparency.
          </p>
        </div>

        <textarea
          rows={3}
          placeholder="Share your single most important priority..."
          value={most_important_improvement}
          onChange={(e) => updateFormData({ most_important_improvement: e.target.value })}
          className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/40"
        />
      </div>

      {/* KEY PROMINENT QUESTION: What do you think Papido should do? */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 rounded-3xl p-6 sm:p-7 border-2 border-amber-400 shadow-md space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Strategic Decision</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
              “What do you think Papido should do?”
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your vote directly informs our leadership team before making rollout commitments.
            </p>
          </div>
          <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full shrink-0 ml-2">
            Required
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {DECISION_OPTIONS.map((item) => {
            const isSelected = launch_recommendation === item.value || launch_recommendation === item.shortVal;
            return (
              <div
                key={item.value}
                onClick={() => updateFormData({ launch_recommendation: item.value })}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? item.style
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-xl sm:text-2xl shrink-0 mt-0.5">{item.badge}</span>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Additional Feedback */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Any additional suggestions for Papido?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Anything else you would like our founding and operations team to know.
          </p>
        </div>

        <textarea
          rows={3}
          placeholder="Any other thoughts, ideas, or feedback..."
          value={additional_feedback}
          onChange={(e) => updateFormData({ additional_feedback: e.target.value })}
          className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/40"
        />
      </div>

      {/* Optional Contact Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={willing_to_contact}
            onChange={(e) => updateFormData({ willing_to_contact: e.target.checked })}
            className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400 mt-0.5 cursor-pointer"
          />
          <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
            I am willing to be contacted about my feedback.
          </span>
        </label>

        {willing_to_contact && (
          <div className="pt-2 border-t border-slate-100 space-y-3 animate-fade-in-up">
            <p className="text-xs text-slate-500">
              Please share your preferred contact details so we can follow up with questions or early beta access.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name (Optional)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Aditi / Rahul"
                    value={contact_name}
                    onChange={(e) => updateFormData({ contact_name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="e.g. 98765 43210"
                      value={contact_mobile}
                      onChange={(e) => updateFormData({ contact_mobile: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="e.g. you@example.com"
                      value={contact_email}
                      onChange={(e) => updateFormData({ contact_email: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-2.5 text-[11px] sm:text-xs text-slate-500">
          <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Privacy Guarantee:</strong> Your contact information is optional and will only be used if you request Papido to contact you regarding your feedback. We never share or sell personal data.
          </span>
        </div>
      </div>

      {/* Navigation & Submit Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 pb-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Step 4</span>
        </button>

        <button
          type="button"
          disabled={!isValid || isSubmitting}
          onClick={onSubmit}
          className={`inline-flex items-center justify-center space-x-2 px-9 py-4 rounded-xl font-bold text-base transition-all cursor-pointer ${
            isValid && !isSubmitting
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting Your Opinion...</span>
            </>
          ) : (
            <>
              <span>Submit Opinion to Papido</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
