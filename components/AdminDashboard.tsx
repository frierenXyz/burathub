import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  Settings, 
  FileCode, 
  Save, 
  LogOut, 
  Plus, 
  Trash2,
  RefreshCw
} from 'lucide-react';
import { AppConfig, DashboardTab, CheckpointConfig } from '../types';
import Button from './Button';

interface AdminDashboardProps {
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ config, onUpdateConfig, onLogout }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('integration');
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdateConfig(localConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const updateCheckpoint = (index: number, field: keyof CheckpointConfig, value: string | number) => {
    const newCheckpoints = [...localConfig.checkpoints];
    newCheckpoints[index] = { ...newCheckpoints[index], [field]: value };
    setLocalConfig({ ...localConfig, checkpoints: newCheckpoints });
  };

  const navItems = [
    { id: 'integration', label: 'Integration', icon: LinkIcon, desc: 'Manage checkpoints & links' },
    { id: 'provider', label: 'Provider', icon: Settings, desc: 'Key settings & metadata' },
    { id: 'lua', label: 'Lua Script', icon: FileCode, desc: 'Manage UI loader script' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh] bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-300">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-zinc-900/80 border-b md:border-b-0 md:border-r border-zinc-800 p-4 flex flex-col">
        <div className="flex items-center space-x-2 px-2 mb-8 mt-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white leading-none">Admin Panel</h3>
            <span className="text-[10px] text-zinc-500 font-mono">V1.0.4-BETA</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <item.icon size={18} />
              <div className="text-left">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-[10px] opacity-60">{item.desc}</div>
              </div>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-zinc-800">
           <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-zinc-500 hover:text-red-400 transition-colors text-sm"
           >
             <LogOut size={16} />
             <span>Sign Out</span>
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/20">
          <h2 className="text-xl font-bold text-white capitalize">{activeTab} Configuration</h2>
          <Button 
            onClick={handleSave} 
            variant="primary" 
            leftIcon={isSaved ? <RefreshCw className="animate-spin" size={16}/> : <Save size={16}/>}
            className={isSaved ? "bg-emerald-500/80" : ""}
          >
            {isSaved ? "Saved!" : "Save Changes"}
          </Button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          
          {/* Integration / Checkpoints Tab */}
          {activeTab === 'integration' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Checkpoint Setup</h3>
                  <p className="text-sm text-zinc-400">Configure the steps users must complete to get a key.</p>
                </div>
              </div>

              <div className="space-y-4">
                {localConfig.checkpoints.map((cp, idx) => (
                  <div key={idx} className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5 relative group">
                    <div className="absolute -left-[1px] top-0 bottom-0 w-1 bg-emerald-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-zinc-500">CHECKPOINT TITLE</label>
                        <input 
                          type="text" 
                          value={cp.title} 
                          onChange={(e) => updateCheckpoint(idx, 'title', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-zinc-500">TARGET URL (AD LINK)</label>
                        <input 
                          type="text" 
                          value={cp.targetUrl} 
                          onChange={(e) => updateCheckpoint(idx, 'targetUrl', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <label className="text-xs font-mono text-zinc-500">DESCRIPTION</label>
                      <input 
                        type="text" 
                        value={cp.description} 
                        onChange={(e) => updateCheckpoint(idx, 'description', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="space-y-1 w-32">
                         <label className="text-xs font-mono text-zinc-500">WAIT TIME (SEC)</label>
                         <input 
                          type="number" 
                          value={cp.waitDurationSeconds} 
                          onChange={(e) => updateCheckpoint(idx, 'waitDurationSeconds', parseInt(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Provider Tab */}
          {activeTab === 'provider' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-medium text-white">Provider Settings</h3>
                <p className="text-sm text-zinc-400">General configuration for your key system instance.</p>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6 space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-500 uppercase">System Name</label>
                    <input 
                      type="text" 
                      value={localConfig.appName}
                      onChange={(e) => setLocalConfig({...localConfig, appName: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-zinc-500 uppercase">Key Prefix</label>
                      <input 
                        type="text" 
                        value={localConfig.keyPrefix}
                        onChange={(e) => setLocalConfig({...localConfig, keyPrefix: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-zinc-500 uppercase">Validity (Hours)</label>
                      <input 
                        type="number" 
                        value={localConfig.keyExpiryHours}
                        onChange={(e) => setLocalConfig({...localConfig, keyExpiryHours: parseInt(e.target.value)})}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* Lua Script Tab */}
          {activeTab === 'lua' && (
            <div className="h-full flex flex-col">
               <div className="mb-4">
                <h3 className="text-lg font-medium text-white">Lua Script Loader</h3>
                <p className="text-sm text-zinc-400">Paste the raw Lua script code that the user will execute.</p>
              </div>
              <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                   <span className="text-xs font-mono text-zinc-500">script.lua</span>
                   <div className="flex space-x-1.5">
                     <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                   </div>
                </div>
                <textarea 
                  value={localConfig.luaScript}
                  onChange={(e) => setLocalConfig({...localConfig, luaScript: e.target.value})}
                  className="flex-1 w-full bg-transparent p-4 text-sm font-mono text-zinc-300 resize-none focus:outline-none leading-relaxed"
                  placeholder="-- Paste your Lua script here..."
                  spellCheck={false}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;