import React, { useState, useRef } from 'react';
import { ShirtConfig, DEFAULT_CONFIG } from './types';
import ShirtSVG from './components/ShirtSVG';
import { ControlPanel } from './components/ControlPanel';
import { TryOnModal } from './components/TryOnModal';
import { svgToPngBase64 } from './utils';
import { ShoppingBag, Wand2, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<ShirtConfig>(DEFAULT_CONFIG);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [designBase64, setDesignBase64] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);

  const updateConfig = (key: keyof ShirtConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleOpenTryOn = async () => {
    if (svgRef.current) {
      try {
        const base64 = await svgToPngBase64(svgRef.current);
        setDesignBase64(base64);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Failed to capture design:", error);
        alert("Could not capture the design. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Nexus 3D Studio</h1>
              <p className="text-xs text-slate-400">Powered by Gemini Nano Banana</p>
            </div>
          </div>
          <button 
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Reset Design"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Workspace */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left: 3D Canvas */}
        <div className="flex-1 bg-slate-800/50 rounded-3xl border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] shadow-2xl">
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
          </div>
          
          {/* Spotlight Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* The Shirt */}
          <div className="relative z-10 w-full max-w-md aspect-[4/5] drop-shadow-2xl transition-all duration-500 ease-out hover:scale-105">
             <ShirtSVG ref={svgRef} config={config} />
          </div>

          {/* AI Action Bar */}
          <div className="absolute bottom-8 z-20">
            <button 
              onClick={handleOpenTryOn}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-600 shadow-lg shadow-indigo-500/25 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center gap-3">
                <Wand2 className="w-5 h-5 group-hover:animate-pulse" /> 
                Generate 3D Try-On
              </span>
            </button>
            <p className="text-center text-xs text-slate-500 mt-3 font-medium tracking-wide uppercase">
              Pro Visualizer Active
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full lg:w-[420px] flex-shrink-0">
          <ControlPanel config={config} updateConfig={updateConfig} />
        </div>

      </main>

      {/* Modal */}
      <TryOnModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        designImageBase64={designBase64} 
        config={config}
      />
    </div>
  );
};

export default App;