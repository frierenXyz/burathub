import React, { useState, useEffect } from 'react';
import { Copy, Check, Key, RefreshCw, FileCode, Download } from 'lucide-react';
import Button from './Button';
import { AppConfig } from '../types';

interface KeyDisplayProps {
  onReset: () => void;
  config: AppConfig;
}

const KeyDisplay: React.FC<KeyDisplayProps> = ({ onReset, config }) => {
  const [key, setKey] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);

  useEffect(() => {
    // Generate a random key on mount using the config prefix
    const randomSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const newKey = `${config.keyPrefix}${randomSegment()}-${randomSegment()}-${randomSegment()}`;
    setKey(newKey);
  }, [config.keyPrefix]);

  const handleCopy = () => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(config.luaScript);
    setScriptCopied(true);
    setTimeout(() => setScriptCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg animate-in fade-in zoom-in duration-500 mx-auto">
      <div className="bg-zinc-900/80 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full text-emerald-400 mb-6 ring-1 ring-emerald-500/30">
          <Key className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Access Granted</h2>
        <p className="text-sm sm:text-base text-zinc-400 mb-6 px-2">
          You have successfully verified. Use this key in the application.
        </p>

        {/* Key Box */}
        <div className="bg-black/50 border border-zinc-800 rounded-xl p-3 sm:p-4 mb-4 flex items-center justify-between group hover:border-zinc-700 transition-colors gap-2">
          <code className="font-mono text-base sm:text-xl text-emerald-400 tracking-wider break-all text-left">
            {key || 'GENERATING...'}
          </code>
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shrink-0"
            title="Copy to clipboard"
          >
            {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
          </button>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          <Button onClick={handleCopy} variant={copied ? "primary" : "primary"} fullWidth>
            {copied ? "Copied to Clipboard" : "Copy Key"}
          </Button>
          
          {config.luaScript && (
             <Button onClick={handleCopyScript} variant="secondary" fullWidth leftIcon={scriptCopied ? <Check size={16}/> : <FileCode size={16}/>}>
               {scriptCopied ? "Script Copied!" : "Copy Lua Script"}
             </Button>
          )}

          <Button onClick={onReset} variant="ghost" fullWidth leftIcon={<RefreshCw size={16}/>}>
            Generate New Key
          </Button>
        </div>

        <p className="text-[10px] sm:text-xs text-zinc-600 mt-2 font-mono">
          {config.appName} Secure System • Valid for {config.keyExpiryHours}h
        </p>
      </div>
    </div>
  );
};

export default KeyDisplay;