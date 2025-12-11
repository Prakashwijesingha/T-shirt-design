import React from 'react';
import { COLORS } from '../types';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  selectedColor: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, selectedColor, onChange }) => {
  return (
    <div className="mb-2">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{label}</label>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-7 h-7 rounded-full border border-slate-200 shadow-sm flex items-center justify-center transition-transform hover:scale-110 ${
              selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-white ring-violet-500 scale-110' : ''
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          >
            {selectedColor === color && (
              <Check className={`w-3.5 h-3.5 ${['#ffffff', '#facc15', '#fab005'].includes(color) ? 'text-black' : 'text-white'}`} />
            )}
          </button>
        ))}
        {/* Custom Input */}
        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-200 shadow-sm hover:scale-110 transition-transform bg-gradient-to-br from-violet-200 to-pink-200">
           <input 
             type="color" 
             value={selectedColor} 
             onChange={(e) => onChange(e.target.value)}
             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 cursor-pointer border-0 opacity-0"
           />
           <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-[8px] font-bold text-violet-700">
             +
           </div>
        </div>
      </div>
    </div>
  );
};