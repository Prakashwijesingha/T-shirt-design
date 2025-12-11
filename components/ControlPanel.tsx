import React from 'react';
import { ShirtConfig } from '../types';
import { ColorPicker } from './ColorPicker';
import { Upload, X, CheckCircle2, Circle, Layers, Type, MousePointer2 } from 'lucide-react';

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
    <div className="bg-white border border-slate-200 rounded-2xl h-full shadow-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-violet-600" />
          Editor Panel
        </h2>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
        
        {/* Section: Garment Type */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Base Garment</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => updateConfig('type', 'polo')}
              className={`relative py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 flex flex-col items-center gap-1 ${
                config.type === 'polo' 
                ? 'border-violet-600 bg-violet-50 text-violet-700 ring-1 ring-violet-200' 
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>Polo Shirt</span>
            </button>
            <button 
              onClick={() => updateConfig('type', 'crew')}
              className={`relative py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 flex flex-col items-center gap-1 ${
                config.type === 'crew' 
                ? 'border-violet-600 bg-violet-50 text-violet-700 ring-1 ring-violet-200' 
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
               <span>Crew Neck</span>
            </button>
          </div>
        </div>

        {/* Section: Colors */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
             <ColorPicker 
              label="Fabric Color" 
              selectedColor={config.baseColor} 
              onChange={(c) => updateConfig('baseColor', c)} 
            />
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
             <ColorPicker 
              label="Sleeve Color" 
              selectedColor={config.sleeveColor} 
              onChange={(c) => updateConfig('sleeveColor', c)} 
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
             <ColorPicker 
              label={config.type === 'polo' ? "Collar & Placket" : "Neck Ribbing"} 
              selectedColor={config.collarColor} 
              onChange={(c) => updateConfig('collarColor', c)} 
            />
            
            <div className="mt-4 pt-3 border-t border-slate-200">
               <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                  <span>Size/Thickness</span>
                  <span className="text-slate-700">{config.collarSize.toFixed(1)}x</span>
               </div>
               <input 
                 type="range" 
                 min="0.8" 
                 max="1.5" 
                 step="0.1"
                 value={config.collarSize}
                 onChange={(e) => updateConfig('collarSize', parseFloat(e.target.value))}
                 className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
               />
            </div>
          </div>
        </div>

        {/* Section: Accents */}
        <div>
           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
             <Type className="w-3 h-3" /> Details & Accents
           </label>
           
           <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="mb-4">
                <span className="text-xs font-medium text-slate-700 mb-2 block">Tipping Lines</span>
                <div className="flex bg-slate-100 rounded-lg p-1">
                  {[0, 1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateConfig('tippingLines', num)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        config.tippingLines === num
                          ? 'bg-white text-violet-700 shadow-sm ring-1 ring-black/5'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {getTippingLabel(num)}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => updateConfig('enableChestStripe', !config.enableChestStripe)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all mb-4 ${
                   config.enableChestStripe 
                   ? 'bg-violet-50 border-violet-200 text-violet-900' 
                   : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-medium">Chest Stripe</span>
                {config.enableChestStripe ? <CheckCircle2 className="w-5 h-5 text-violet-600" /> : <Circle className="w-5 h-5 text-slate-300" />}
              </button>

              {(config.tippingLines > 0 || config.enableChestStripe) && (
                <div className="pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
                  <ColorPicker 
                    label="Accent Color" 
                    selectedColor={config.accentColor} 
                    onChange={(c) => updateConfig('accentColor', c)} 
                  />
                </div>
              )}
           </div>
        </div>

        {config.type === 'polo' && (
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
             <ColorPicker 
              label="Button Color" 
              selectedColor={config.buttonColor} 
              onChange={(c) => updateConfig('buttonColor', c)} 
            />
          </div>
        )}

        {/* Section: Branding */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
            <MousePointer2 className="w-3 h-3" /> Branding
          </label>
          
          {!config.logoUrl ? (
            <div className="relative border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-xl p-6 transition-all bg-slate-50 hover:bg-white group text-center">
               <input 
                type="file" 
                accept="image/*" 
                id="logo-upload"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                   <Upload className="w-4 h-4 text-violet-600" />
                </div>
                <span className="text-sm text-slate-600 font-medium group-hover:text-violet-700">Upload Logo</span>
                <span className="text-[10px] text-slate-400 mt-1">PNG or JPG recommended</span>
              </label>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center p-1">
                   <img src={config.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-semibold text-slate-800">Logo Applied</p>
                   <button 
                    onClick={() => updateConfig('logoUrl', null)}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 mt-0.5"
                   >
                     <X className="w-3 h-3" /> Remove
                   </button>
                 </div>
              </div>

              <div>
                 <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                    <span>Scale</span>
                    <span className="text-slate-700">{Math.round(config.logoScale * 100)}%</span>
                 </div>
                 <input 
                   type="range" 
                   min="0.5" 
                   max="2" 
                   step="0.1"
                   value={config.logoScale}
                   onChange={(e) => updateConfig('logoScale', parseFloat(e.target.value))}
                   className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                 />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};