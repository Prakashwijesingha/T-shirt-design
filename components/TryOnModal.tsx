import React, { useState } from 'react';
import { Gender, ShirtConfig } from '../types';
import { generateTryOn } from '../services/geminiService';
import { Loader2, Shirt, User, X, Download, Sparkles } from 'lucide-react';

interface TryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  designImageBase64: string | null;
  config: ShirtConfig;
}

export const TryOnModal: React.FC<TryOnModalProps> = ({ isOpen, onClose, designImageBase64, config }) => {
  const [selectedGender, setSelectedGender] = useState<Gender>('male');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!designImageBase64) return;
    
    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await generateTryOn(designImageBase64, selectedGender, config);
      setResultImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate try-on image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `nexus-tryon-${config.type}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
        {/* Left Side: Controls */}
        <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h3 className="text-xl font-bold text-slate-800">Virtual Try-On</h3>
            <button onClick={onClose}><X className="text-slate-400" /></button>
          </div>
          
          <div className="hidden md:block mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold mb-3">
               <Sparkles className="w-3 h-3" /> AI Powered
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Model View</h3>
            <p className="text-sm text-slate-500 mt-1">See your design on a realistic human model.</p>
          </div>

          <div className="space-y-4 mb-8">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Model</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedGender('male')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  selectedGender === 'male' 
                  ? 'border-violet-600 bg-violet-50 text-violet-700 shadow-sm' 
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-medium text-sm">Men</span>
              </button>
              <button
                onClick={() => setSelectedGender('female')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  selectedGender === 'female' 
                  ? 'border-violet-600 bg-violet-50 text-violet-700 shadow-sm' 
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-medium text-sm">Women</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !designImageBase64}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Shirt className="w-5 h-5" />
                Generate Preview
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div className="mt-auto pt-6 text-xs text-slate-400 text-center">
             Powered by Gemini 2.5 Flash
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="w-full md:w-2/3 bg-slate-100 relative flex flex-col items-center justify-center p-6 min-h-[400px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
           <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-slate-100 transition-colors hidden md:block z-10 border border-slate-200 shadow-sm">
              <X className="w-5 h-5 text-slate-500" />
           </button>

           {loading ? (
             <div className="text-center">
               <div className="relative w-16 h-16 mx-auto mb-6">
                 <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
               </div>
               <p className="text-slate-800 font-semibold text-lg">Creating photoshoot...</p>
               <p className="text-sm text-slate-500 mt-1">AI is applying fabric physics & lighting</p>
             </div>
           ) : resultImage ? (
             <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img 
                  src={resultImage} 
                  alt="AI Generated Try On" 
                  className="max-w-full max-h-[60vh] md:max-h-[70vh] rounded-lg shadow-xl object-contain mb-6 border border-white bg-white"
                />
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-full hover:bg-slate-900 transition-colors shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Download High-Res
                </button>
             </div>
           ) : (
             <div className="text-center text-slate-400">
               <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center border border-slate-200 shadow-sm">
                 <User className="w-8 h-8 text-slate-300" />
               </div>
               <p className="font-medium text-slate-500">Ready to render</p>
               <p className="text-sm">Select a model to begin</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};