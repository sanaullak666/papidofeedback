import React from 'react';

const STEP_TITLES = [
  'Welcome',
  'WhatsApp Experience',
  'New System Preview',
  'Website Opinion',
  'Preference & Comparison',
  'Features & Decision',
];

export default function StepIndicator({ currentStep, totalSteps = 5 }) {
  if (currentStep < 1 || currentStep > totalSteps) return null;

  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full max-w-xl mx-auto mb-6 sm:mb-8 px-4">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
        <span className="inline-flex items-center space-x-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Step {currentStep} of {totalSteps}</span>
        </span>
        <span className="text-slate-600 font-medium">{STEP_TITLES[currentStep]}</span>
        <span className="text-slate-400 font-mono text-[11px]">{percentage}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
