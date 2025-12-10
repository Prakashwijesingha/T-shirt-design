import React, { useState } from 'react';
import { Gender, ShirtConfig } from '../types';
import { generateTryOn } from '../services/geminiService';
import { Loader2, Shirt, User, X } from 'lucide-react';

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
      // We now pass the entire config object
      const result = await generateTryOn(designImageBase64, selectedGender, config);
      setResultImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate try-on image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Controls */}
        <div className="w-full md:w-1/3 p-6 border-r border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h3 className="text-xl font-bold">AI Virtual Try-On</h3>
            <button onClick={onClose}><X className="text-slate-400" /></button>
          </div>
          
          <div className="hidden md:block mb-6">
            <h3 className="text-xl font-bold text-slate-800">AI Virtual Try-On</h3>
            <p className="text-sm text-slate-500 mt-1">Visualize your design on a real model.</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedGender('male')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  selectedGender === 'male' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-medium">Men</span>
              </button>
              <button
                onClick={() => setSelectedGender('female')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  selectedGender === 'female' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-medium">Women</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !designImageBase64}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Shirt className="w-5 h-5" />
                Generate Preview
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div className="mt-auto pt-6 text-xs text-slate-400 text-center">
             Powered by Gemini 2.5 Flash
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="w-full md:w-2/3 bg-slate-50 relative flex items-center justify-center p-6 min-h-[400px]">
           <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors hidden md:block z-10">
              <X className="w-5 h-5 text-slate-600" />
           </button>

           {loading ? (
             <div className="text-center">
               <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
               <p className="text-slate-500 font-medium">Creating your photoshoot...</p>
               <p className="text-xs text-slate-400 mt-2">This may take a few seconds</p>
             </div>
           ) : resultImage ? (
             <img 
              src={resultImage} 
              alt="AI Generated Try On" 
              className="max-w-full max-h-[80vh] rounded-lg shadow-lg object-contain"
            />
           ) : (
             <div className="text-center text-slate-400">
               <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                 <User className="w-10 h-10 text-slate-400" />
               </div>
               <p>Select a model and click generate to see the magic.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};