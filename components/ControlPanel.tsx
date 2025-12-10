import React from 'react';
import { ShirtConfig } from '../types';
import { ColorPicker } from './ColorPicker';
import { Upload, X, CheckCircle2, Circle } from 'lucide-react';

interface ControlPanelProps {
  config: ShirtConfig;
  updateConfig: (key: keyof ShirtConfig, value: any) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, updateConfig }) => {
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateConfig('logoUrl', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getTippingLabel = (num: number) => {
    switch (num) {
      case 0: return 'None';
      case 1: return 'Single';
      case 2: return 'Double';
      case 3: return 'Triple';
      default: return '';
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 h-full shadow-xl overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white">Configuration</h2>
        <span className="px-3 py-1 bg-slate-700 rounded-full text-xs font-medium text-slate-300">v2.9</span>
      </div>

      {/* Style Selection */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Garment Type</label>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => updateConfig('type', 'polo')}
            className={`relative py-4 px-4 rounded-2xl border-2 font-medium transition-all duration-200 overflow-hidden group ${
              config.type === 'polo' 
              ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
              : 'border-slate-700 bg-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            <span className="relative z-10">Polo Shirt</span>
            {config.type === 'polo' && <div className="absolute inset-0 bg-indigo-500 opacity-10"></div>}
          </button>
          <button 
            onClick={() => updateConfig('type', 'crew')}
            className={`relative py-4 px-4 rounded-2xl border-2 font-medium transition-all duration-200 overflow-hidden group ${
              config.type === 'crew' 
              ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
              : 'border-slate-700 bg-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
             <span className="relative z-10">Crew Neck</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
           <ColorPicker 
            label="Base Fabric Color" 
            selectedColor={config.baseColor} 
            onChange={(c) => updateConfig('baseColor', c)} 
          />
        </div>
        
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
           <ColorPicker 
            label="Sleeve Details" 
            selectedColor={config.sleeveColor} 
            onChange={(c) => updateConfig('sleeveColor', c)} 
          />
        </div>

        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
           <ColorPicker 
            label={config.type === 'polo' ? "Collar & Placket" : "Neck Ribbing"} 
            selectedColor={config.collarColor} 
            onChange={(c) => updateConfig('collarColor', c)} 
          />
          
          <div className="mt-4 pt-4 border-t border-slate-700">
             <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>{config.type === 'polo' ? 'Collar Spread' : 'Rib Thickness'}</span>
                <span>{config.collarSize.toFixed(1)}x</span>
             </div>
             <input 
               type="range" 
               min="0.8" 
               max="1.5" 
               step="0.1"
               value={config.collarSize}
               onChange={(e) => updateConfig('collarSize', parseFloat(e.target.value))}
               className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
             />
          </div>
        </div>

        {/* Accents Section */}
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
          <label className="block text-sm font-semibold text-slate-300 mb-4">Accents & Stripes</label>
          
          {/* Tipping Lines Selector - Updated Labels */}
          <div className="mb-5">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2 block">
              Collar & Cuff Style
            </span>
            <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
              {[0, 1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => updateConfig('tippingLines', num)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    config.tippingLines === num
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  {getTippingLabel(num)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <button 
              onClick={() => updateConfig('enableChestStripe', !config.enableChestStripe)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <span className="text-sm font-medium text-slate-300">Chest Stripe (Below Collar)</span>
              {config.enableChestStripe ? <CheckCircle2 className="w-5 h-5 text-indigo-500" /> : <Circle className="w-5 h-5 text-slate-500" />}
            </button>
          </div>

          {(config.tippingLines > 0 || config.enableChestStripe) && (
            <div className="pt-2 border-t border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
              <ColorPicker 
                label="Accent Color" 
                selectedColor={config.accentColor} 
                onChange={(c) => updateConfig('accentColor', c)} 
              />
            </div>
          )}
        </div>

        {/* Conditional Button Color Picker for Polos */}
        {config.type === 'polo' && (
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
             <ColorPicker 
              label="Button Color" 
              selectedColor={config.buttonColor} 
              onChange={(c) => updateConfig('buttonColor', c)} 
            />
          </div>
        )}
      </div>

      <hr className="border-slate-700 my-8" />

      {/* Logo Upload */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Branding</label>
        
        {!config.logoUrl ? (
          <div className="group relative border-2 border-dashed border-slate-600 hover:border-indigo-500 rounded-2xl p-8 transition-all bg-slate-900/30 hover:bg-slate-800">
             <input 
              type="file" 
              accept="image/*" 
              id="logo-upload"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <Upload className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-sm text-slate-300 font-medium">Upload Brand Logo</span>
              <span className="text-xs text-slate-500 mt-1">Supports PNG with transparency</span>
            </label>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-inner">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-16 h-16 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center p-2">
                 <img src={config.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
               </div>
               <div className="flex-1">
                 <p className="text-sm font-medium text-white">Logo Active</p>
                 <button 
                  onClick={() => updateConfig('logoUrl', null)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 mt-1 transition-colors"
                 >
                   <X className="w-3 h-3" /> Remove Asset
                 </button>
               </div>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between text-xs text-slate-400">
                  <span>Scale</span>
                  <span>{Math.round(config.logoScale * 100)}%</span>
               </div>
               <input 
                 type="range" 
                 min="0.5" 
                 max="2" 
                 step="0.1"
                 value={config.logoScale}
                 onChange={(e) => updateConfig('logoScale', parseFloat(e.target.value))}
                 className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
               />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};