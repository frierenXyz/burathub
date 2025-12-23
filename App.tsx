import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ChevronRight, Settings } from 'lucide-react';
import { SystemStep, AppConfig, AdminView } from './types';
import { CHECKPOINTS, APP_NAME, KEY_PREFIX, KEY_EXPIRY_HOURS } from './constants';
import ProgressBar from './components/ProgressBar';
import CheckpointStep from './components/CheckpointStep';
import KeyDisplay from './components/KeyDisplay';
import Button from './components/Button';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// Default initial config
const DEFAULT_CONFIG: AppConfig = {
  appName: APP_NAME,
  keyPrefix: KEY_PREFIX,
  keyExpiryHours: KEY_EXPIRY_HOURS,
  checkpoints: CHECKPOINTS,
  luaScript: `-- Default Script loaded from ${APP_NAME}\nprint("Hello World")`
};

const App: React.FC = () => {
  // Config State
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // App Flow State
  const [currentStep, setCurrentStep] = useState<SystemStep>(SystemStep.WELCOME);
  const [adminView, setAdminView] = useState<AdminView | null>(null);

  // Load config from local storage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('nexus_config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save config whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nexus_config', JSON.stringify(config));
    }
  }, [config, isLoaded]);

  const handleStart = () => {
    setCurrentStep(SystemStep.CHECKPOINT_1);
  };

  const handleCheckpointComplete = () => {
    if (currentStep === SystemStep.CHECKPOINT_1) {
      // Check if there is a second checkpoint configured
      if (config.checkpoints.length > 1) {
        setCurrentStep(SystemStep.CHECKPOINT_2);
      } else {
        setCurrentStep(SystemStep.KEY_GENERATED);
      }
    } else if (currentStep === SystemStep.CHECKPOINT_2) {
      setCurrentStep(SystemStep.KEY_GENERATED);
    }
  };

  const handleReset = () => {
    setCurrentStep(SystemStep.WELCOME);
  };

  const toggleAdmin = () => {
    if (adminView) {
      setAdminView(null);
    } else {
      setAdminView('login');
    }
  };

  if (!isLoaded) return null;

  // Render Admin Interface
  if (adminView === 'login') {
    return (
      <div className="min-h-[100dvh] bg-background text-zinc-100 flex items-center justify-center p-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]"></div>
        </div>
        <AdminLogin 
          onLogin={() => setAdminView('dashboard')} 
          onBack={() => setAdminView(null)} 
        />
      </div>
    );
  }

  if (adminView === 'dashboard') {
    return (
      <div className="min-h-[100dvh] bg-background text-zinc-100 flex items-center justify-center p-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-background to-background"></div>
        </div>
        <AdminDashboard 
          config={config} 
          onUpdateConfig={setConfig} 
          onLogout={() => setAdminView(null)} 
        />
      </div>
    );
  }

  // Render User Interface
  return (
    <div className="min-h-[100dvh] bg-background text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30">
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-violet-500/10 rounded-full blur-[80px] sm:blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-[80px] sm:blur-[100px]"></div>
      </div>

      {/* Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleReset}>
            <ShieldCheck className="text-emerald-500 w-6 h-6 sm:w-auto sm:h-auto" />
            <span className="font-bold text-base sm:text-lg tracking-tight truncate max-w-[150px] sm:max-w-none">{config.appName}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={toggleAdmin} className="text-zinc-600 hover:text-zinc-400 transition-colors">
              <Settings size={16} />
            </button>
            <div className="text-[10px] sm:text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-1 rounded hidden sm:block">
              v2.2.0
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 w-full max-w-5xl mx-auto">
        
        {/* Steps Visualizer */}
        {currentStep !== SystemStep.WELCOME && (
          <ProgressBar currentStep={currentStep} totalSteps={3} />
        )}

        {/* View Switcher */}
        {currentStep === SystemStep.WELCOME && (
          <div className="text-center w-full max-w-lg space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 py-8 sm:py-0">
            <div className="inline-block p-3 sm:p-4 bg-zinc-900 rounded-full border border-zinc-800 shadow-2xl mb-2 sm:mb-4">
              <Lock className="text-zinc-400 w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {config.appName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-violet-400">Gateway</span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg px-2 sm:px-0">
              Complete the security checkpoints to generate your unique access key.
            </p>
            <div className="pt-4 px-4 sm:px-0">
              <Button 
                onClick={handleStart} 
                className="w-full sm:w-auto min-w-[200px]"
                rightIcon={<ChevronRight size={20} />}
                variant="primary"
                fullWidth={true} 
              >
                Get Started
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-600 mt-8">
              Protected by {config.appName} Verification
            </p>
          </div>
        )}

        {currentStep === SystemStep.CHECKPOINT_1 && config.checkpoints[0] && (
          <CheckpointStep 
            config={config.checkpoints[0]} 
            onComplete={handleCheckpointComplete} 
          />
        )}

        {currentStep === SystemStep.CHECKPOINT_2 && config.checkpoints[1] && (
          <CheckpointStep 
            config={config.checkpoints[1]} 
            onComplete={handleCheckpointComplete} 
          />
        )}

        {currentStep === SystemStep.KEY_GENERATED && (
          <KeyDisplay onReset={handleReset} config={config} />
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-800/50 text-center shrink-0">
        <p className="text-zinc-600 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} {config.appName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;