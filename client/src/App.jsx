import React, { useState, useEffect } from 'react';
import { api } from './services/api.js';
import { useAuth } from './context/AuthContext.jsx';

// Public Components
import Header from './components/public/Header.jsx';
import Footer from './components/public/Footer.jsx';
import StepIndicator from './components/public/StepIndicator.jsx';
import LandingHero from './components/public/LandingHero.jsx';
import Step1WhatsApp from './components/public/Step1WhatsApp.jsx';
import Step2IntroWebsite from './components/public/Step2IntroWebsite.jsx';
import Step3WebsiteOpinion from './components/public/Step3WebsiteOpinion.jsx';
import Step4WhatsAppVsWebsite from './components/public/Step4WhatsAppVsWebsite.jsx';
import Step5FeaturesAndDecision from './components/public/Step5FeaturesAndDecision.jsx';
import ThankYouPage from './components/public/ThankYouPage.jsx';
import PrivacyModal from './components/public/PrivacyModal.jsx';

// Admin Components
import AdminNavbar from './components/admin/AdminNavbar.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminFeedback from './pages/admin/AdminFeedback.jsx';
import AdminLogs from './pages/admin/AdminLogs.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

const DEFAULT_FORM_DATA = {
  // Step 1
  whatsapp_satisfaction: null,
  whatsapp_likes: [],
  whatsapp_likes_other: '',
  whatsapp_difficulties: [],
  whatsapp_difficulties_other: '',

  // Step 2 & 3
  explored_website: false,
  website_opinion: '',
  website_ease_of_use: '',
  website_likes: [],
  website_likes_other: '',
  website_improvements: '',

  // Step 4
  preferred_booking_method: '',
  website_adoption_intent: '',
  continue_whatsapp: '',
  both_convenience: '',

  // Step 5
  requested_features: [],
  requested_features_other: '',
  most_important_improvement: '',
  launch_recommendation: '',

  // Final & Contact
  additional_feedback: '',
  willing_to_contact: false,
  contact_name: '',
  contact_mobile: '',
  contact_email: '',
};

export default function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [newBookingUrl, setNewBookingUrl] = useState(
    import.meta.env.VITE_NEW_BOOKING_URL || 'https://www.papido.online'
  );
  const [surveyActive, setSurveyActive] = useState(true);

  // Survey Flow State
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const savedStep = localStorage.getItem('papido_survey_step');
      return savedStep !== null ? parseInt(savedStep, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('papido_survey_draft');
      return saved ? { ...DEFAULT_FORM_DATA, ...JSON.parse(saved) } : DEFAULT_FORM_DATA;
    } catch {
      return DEFAULT_FORM_DATA;
    }
  });

  const [feedbackRef, setFeedbackRef] = useState(() => {
    return localStorage.getItem('papido_last_ref') || '';
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Sync route changes with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch Public Settings on startup
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await api.getPublicSettings();
        if (res.success && res.settings) {
          if (res.settings.newBookingWebsiteUrl) {
            setNewBookingUrl(res.settings.newBookingWebsiteUrl);
          }
          if (res.settings.surveyActive !== undefined) {
            setSurveyActive(res.settings.surveyActive !== false);
          }
        }
      } catch (err) {
        // Fallback to default
      }
    }
    loadConfig();
  }, [currentPath]);

  // Persist draft to local storage
  const updateFormData = (patch) => {
    setFormData((prev) => {
      const updated = { ...prev, ...patch };
      try {
        localStorage.setItem('papido_survey_draft', JSON.stringify(updated));
      } catch (e) {
        // ignore storage errors
      }
      return updated;
    });
  };

  const handleStepChange = (newStep) => {
    setCurrentStep(newStep);
    try {
      localStorage.setItem('papido_survey_step', String(newStep));
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetSurvey = (targetStep = 0) => {
    localStorage.removeItem('papido_survey_draft');
    localStorage.removeItem('papido_survey_step');
    setFormData(DEFAULT_FORM_DATA);
    setSubmitError(null);
    handleStepChange(targetStep);
  };

  const handleExploreWebsite = () => {
    updateFormData({ explored_website: true });
    window.open(newBookingUrl, '_blank', 'noopener,noreferrer');
  };

  // Survey Submission
  const handleSubmitSurvey = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const res = await api.submitSurvey(formData);
      if (res.success && res.feedbackRef) {
        setFeedbackRef(res.feedbackRef);
        localStorage.setItem('papido_last_ref', res.feedbackRef);
        // Clear draft
        localStorage.removeItem('papido_survey_draft');
        localStorage.removeItem('papido_survey_step');
        setCurrentStep('completed');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitError(res.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setSubmitError(err.message || 'A network error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin Route Handler
  if (currentPath.startsWith('/admin')) {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!isAuthenticated && currentPath !== '/admin/login') {
      return <AdminLogin onNavigate={navigate} />;
    }

    if (currentPath === '/admin/login') {
      if (isAuthenticated) {
        navigate('/admin/dashboard');
        return null;
      }
      return <AdminLogin onNavigate={navigate} />;
    }

    return (
      <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
        <AdminNavbar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">
          {currentPath === '/admin/dashboard' && <AdminDashboard onNavigate={navigate} />}
          {currentPath === '/admin/feedback' && <AdminFeedback />}
          {currentPath === '/admin/logs' && <AdminLogs />}
          {currentPath === '/admin/settings' && <AdminSettings />}
        </main>
      </div>
    );
  }

  // Public Survey Flow
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Header
        currentStep={currentStep}
        onReset={() => handleStepChange(0)}
        newBookingUrl={newBookingUrl}
      />

      <main className="flex-1 py-4 sm:py-8">
        {/* Step Indicator (Steps 1 to 5) */}
        {currentStep >= 1 && currentStep <= 5 && (
          <StepIndicator currentStep={currentStep} totalSteps={5} />
        )}

        {/* Global Error Banner */}
        {submitError && (
          <div className="max-w-xl mx-auto px-4 mb-4">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold">
              ⚠️ {submitError}
            </div>
          </div>
        )}

        {/* Flow Steps */}
        {currentStep === 0 && (
          <LandingHero
            onStart={() => {
              if (!surveyActive) {
                setSubmitError('Papido is not currently accepting new feedback responses at this time.');
                return;
              }
              handleStepChange(1);
            }}
            onExploreWebsite={handleExploreWebsite}
            newBookingUrl={newBookingUrl}
            surveyActive={surveyActive}
          />
        )}

        {currentStep === 1 && (
          <Step1WhatsApp
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => handleStepChange(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2IntroWebsite
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => handleStepChange(3)}
            onBack={() => handleStepChange(1)}
            newBookingUrl={newBookingUrl}
          />
        )}

        {currentStep === 3 && (
          <Step3WebsiteOpinion
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => handleStepChange(4)}
            onBack={() => handleStepChange(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4WhatsAppVsWebsite
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => handleStepChange(5)}
            onBack={() => handleStepChange(3)}
          />
        )}

        {currentStep === 5 && (
          <Step5FeaturesAndDecision
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmitSurvey}
            onBack={() => handleStepChange(4)}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 'completed' && (
          <ThankYouPage
            feedbackRef={feedbackRef}
            onReset={() => handleResetSurvey(0)}
            newBookingUrl={newBookingUrl}
          />
        )}
      </main>

      <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
