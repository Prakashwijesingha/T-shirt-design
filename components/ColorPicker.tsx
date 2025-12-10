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
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border border-slate-200 shadow-sm flex items-center justify-center transition-transform hover:scale-110 ${
              selectedColor === color ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          >
            {selectedColor === color && (
              <Check className={`w-4 h-4 ${['#ffffff', '#facc15', '#fab005'].includes(color) ? 'text-black' : 'text-white'}`} />
            )}
          </button>
        ))}
        {/* Custom Input */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm hover:scale-110 transition-transform">
           <input 
             type="color" 
             value={selectedColor} 
             onChange={(e) => onChange(e.target.value)}
             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 cursor-pointer border-0"
           />
        </div>
      </div>
    </div>
  );
};