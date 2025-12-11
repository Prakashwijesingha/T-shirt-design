import React, { useState, useRef, useEffect } from 'react';
import { ShirtConfig, DEFAULT_CONFIG } from './types';
import ShirtSVG from './components/ShirtSVG';
import { ControlPanel } from './components/ControlPanel';
import { TryOnModal } from './components/TryOnModal';
import { svgToPngBase64 } from './utils';
import { ShoppingBag, Wand2, RefreshCcw, Palette, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const ApiKeyLanding = ({ onConnect }: { onConnect: () => void }) => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans text-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#f3e8ff,transparent_40%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,#ccfbf1,transparent_40%)]" />
        
        <div className="relative z-10 max-w-xl w-full">
            <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl rotate-3">
                <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500">Ultra</span> Studio
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Experience the next generation of fashion design with 
                <span className="font-semibold text-slate-800"> Gemini 3.0 Pro (Nano Banana Pro)</span>. 
                Create hyper-realistic 3D mockups and virtual try-ons in seconds.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-left">
                <div className="flex items-start gap-3 mb-4">
                    <ShieldCheck className="w-5 h-5 text-violet-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-slate-800 text-sm">Pro Feature Access</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            To access the high-fidelity rendering engine, 
                            you need to connect a paid Google Cloud Project API key.
                        </p>
                    </div>
                </div>
                 <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-violet-600 hover:text-violet-700 underline ml-8"
                >
                    Learn about Gemini API billing
                </a>
            </div>

            <button 
                onClick={onConnect}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-slate-900 rounded-xl hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1 focus:outline-none ring-offset-2 focus:ring-2 ring-slate-900"
            >
                <span>Connect API Key</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    </div>
);

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState(false);
  const [config, setConfig] = useState<ShirtConfig>(DEFAULT_CONFIG);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [designBase64, setDesignBase64] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasKey(has);
      } else {
        // Fallback or dev mode: assume true if not in the specific environment, 
        // or set to false to force prompt. Setting false to be safe.
        setHasKey(false);
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
      if (window.aistudio?.openSelectKey) {
          await window.aistudio.openSelectKey();
          setHasKey(true);
      } else {
          // Dev fallback
          alert("Key selection is only available in the AI Studio environment.");
          setHasKey(true); 
      }
  };

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

  if (!hasKey) {
    return <ApiKeyLanding onConnect={handleConnectKey} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC] font-sans">
      {/* Navbar - Clean White with Soft Border */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-violet-600 to-teal-400 rounded-lg flex items-center justify-center shadow-md">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500">Ultra</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          
          <button 
              onClick={handleOpenTryOn}
              className="group relative inline-flex items-center justify-center px-6 py-2.5 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-violet-600 to-teal-500 rounded-lg hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              <span>Generate 3D Mockup</span>
            </button>
        </div>
      </nav>

      {/* Workspace */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left: 3D Canvas - White Card Style */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] shadow-sm">
          
          {/* Subtle Dot Grid Background */}
          <div className="absolute inset-0 opacity-[0.4]" 
               style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>
          
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-violet-100 to-teal-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />

          {/* The Shirt */}
          <div className="relative z-10 w-full max-w-[500px] aspect-[4/5] transition-all duration-500 p-6">
             <ShirtSVG ref={svgRef} config={config} />
          </div>

          <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-500 shadow-sm flex items-center gap-2">
            <Palette className="w-3 h-3 text-violet-500" />
            Interactive Studio Preview
          </div>
        </div>

        {/* Right: Controls - Clean Sidebar */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
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