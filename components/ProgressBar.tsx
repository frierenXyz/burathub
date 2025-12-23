import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Calculate percentage. We map steps 0..totalSteps to 0%..100%
  // Step 0 = 0%, Step 1 = 33%, Step 2 = 66%, Step 3 = 100%
  const progress = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full max-w-md mb-6 sm:mb-8 px-2 sm:px-0">
      <div className="flex justify-between text-[10px] sm:text-xs text-zinc-500 mb-2 font-mono uppercase tracking-wider">
        <span>Initiation</span>
        <span>Processing</span>
        <span>Completion</span>
      </div>
      <div className="h-1.5 sm:h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-600 to-violet-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;