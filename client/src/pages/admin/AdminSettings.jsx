import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Settings, Save, Globe, Shield, CheckCircle2, Server, Key, AlertCircle } from 'lucide-react';

export default function AdminSettings() {
  const [websiteUrl, setWebsiteUrl] = useState('https://www.papido.online');
  const [surveyActive, setSurveyActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.getPublicSettings();
        if (res.success && res.settings) {
          setWebsiteUrl(res.settings.newBookingWebsiteUrl || 'https://www.papido.online');
          setSurveyActive(res.settings.surveyActive !== false);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.updateSettings({
        new_booking_website_url: websiteUrl,
        survey_active: surveyActive,
      });
      if (res.success) {
        setNotification({ type: 'success', message: 'Settings successfully updated!' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in-up">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl shadow-lg border text-sm font-semibold flex items-center space-x-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{notification.message}</span>
        </div>
      )}

      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
          System Settings & Links
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure survey parameters, external booking URLs, and operational switches.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Configurable Booking URL Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center space-x-3 text-slate-900">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">New Papido Booking Website URL</h2>
              <p className="text-xs text-slate-500">
                The URL that riders will visit when they click "Explore the New Papido Booking Website".
              </p>
            </div>
          </div>

          <div>
            <input
              type="url"
              required
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://www.papido.online or https://preview.papido.online"
              className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Current live target: <strong className="text-slate-700">{websiteUrl}</strong>
            </p>
          </div>
        </div>

        {/* Master Survey Switch: Enable / Disable New Responses */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">Accepting New Feedback Responses</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    surveyActive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {surveyActive ? '🟢 Submissions Open' : '🔴 Submissions Paused'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Master switch to enable or disable public survey submissions from riders.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={surveyActive}
                onChange={(e) => setSurveyActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className={`p-3.5 rounded-2xl text-xs border ${
            surveyActive 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            {surveyActive ? (
              <span>
                ✓ <strong>Public feedback is currently active:</strong> Riders can access the multi-step survey and submit opinions.
              </span>
            ) : (
              <span>
                ⚠️ <strong>Submissions are paused:</strong> The public website displays a polite notice that feedback intake is closed, and any API submissions will be rejected.
              </span>
            )}
          </div>
        </div>

        {/* Security & System Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center space-x-3 text-slate-900">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Security & Environment Information</h2>
              <p className="text-xs text-slate-500">Production safety guarantees</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-800 block mb-0.5">Database Driver</span>
              <span>MySQL 8.0 with Connection Pooling & Prepared Statements</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-800 block mb-0.5">Auth Protocol</span>
              <span>JWT (JSON Web Tokens) with Bcrypt Password Hashing</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-800 block mb-0.5">Domain Ready</span>
              <span>Suggested Domain: feedback.papido.online</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-800 block mb-0.5">Rate Limiting</span>
              <span>Enabled on survey submissions & admin login endpoints</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
