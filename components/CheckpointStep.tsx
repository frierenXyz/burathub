import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle, Clock, ArrowRight, ShieldAlert, AlertCircle } from 'lucide-react';
import { CheckpointConfig } from '../types';
import Button from './Button';

interface CheckpointStepProps {
  config: CheckpointConfig;
  onComplete: () => void;
}

const CheckpointStep: React.FC<CheckpointStepProps> = ({ config, onComplete }) => {
  const [stepState, setStepState] = useState<'idle' | 'clicked' | 'waiting' | 'ready'>('idle');
  const [timeLeft, setTimeLeft] = useState(config.waitDurationSeconds);
  const [hasLeftTab, setHasLeftTab] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Monitor if the user actually leaves the tab (clicks the link)
  useEffect(() => {
    const handleBlur = () => {
      if (stepState === 'clicked' || stepState === 'waiting') {
        setHasLeftTab(true);
      }
    };
    
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [stepState]);

  // Timer logic
  useEffect(() => {
    let interval: number;
    if (stepState === 'waiting' && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && stepState === 'waiting') {
      setStepState('ready');
    }
    return () => clearInterval(interval);
  }, [stepState, timeLeft]);

  const handleLinkClick = () => {
    setError(null);
    setHasLeftTab(false);
    // Reset time just in case, though usually state resets on mount if key changes
    setTimeLeft(config.waitDurationSeconds);
    
    // Open the link
    window.open(config.targetUrl, '_blank');
    
    // Start waiting
    setStepState('waiting');
  };

  const handleVerify = () => {
    // Strictness Check: Did they actually leave the tab?
    if (!hasLeftTab) {
      setError("Verification failed. Link not opened.");
      setStepState('idle'); // Reset to force them to try again
      return;
    }
    onComplete();
  };

  return (
    <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 sm:p-8 backdrop-blur-sm shadow-xl">
        <div className="flex items-center space-x-3 mb-5 sm:mb-6">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-zinc-800 flex items-center justify-center text-emerald-500 border border-zinc-700 shrink-0">
             <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">{config.title}</h2>
            <p className="text-xs sm:text-sm text-zinc-400">Step {config.id} of 2</p>
          </div>
        </div>

        <p className="text-zinc-300 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
          {config.description}
        </p>

        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3 text-red-200 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Step A: Click Link */}
          <div className={`p-4 rounded-xl border transition-all duration-300 ${stepState !== 'idle' && !error ? 'bg-zinc-800/50 border-emerald-500/30' : 'bg-zinc-800 border-zinc-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-zinc-200">Action Required</span>
              {(stepState === 'waiting' || stepState === 'ready') && <CheckCircle className="text-emerald-500 h-4 w-4" />}
            </div>
            <Button 
              variant="outline" 
              fullWidth 
              onClick={handleLinkClick}
              rightIcon={<ExternalLink size={16} />}
              disabled={stepState === 'waiting' || stepState === 'ready'}
            >
              {stepState === 'idle' ? 'Visit Partner Site' : 'Link Opened'}
            </Button>
          </div>

          {/* Step B: Verify */}
          {stepState !== 'idle' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center justify-center p-4">
                {stepState === 'waiting' ? (
                  <div className="flex items-center space-x-2 text-zinc-400 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800">
                    <Clock size={16} className="animate-pulse text-violet-400" />
                    <span className="text-sm font-mono">Verifying... {timeLeft}s</span>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    fullWidth 
                    onClick={handleVerify}
                    rightIcon={<ArrowRight size={18} />}
                    className="animate-pulse-subtle"
                  >
                    Verify & Continue
                  </Button>
                )}
              </div>
              {stepState === 'waiting' && (
                <p className="text-xs text-center text-zinc-500 mt-2">
                  Please keep the partner tab open to verify.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckpointStep;