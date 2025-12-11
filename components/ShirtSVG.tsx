import React, { forwardRef } from 'react';
import { ShirtConfig } from '../types';

interface ShirtSVGProps {
  config: ShirtConfig;
  className?: string;
}

const ShirtSVG = forwardRef<SVGSVGElement, ShirtSVGProps>(({ config, className }, ref) => {
  const { 
    type, baseColor, sleeveColor, collarColor, buttonColor, 
    collarSize, logoUrl, logoScale,
    tippingLines, enableChestStripe, accentColor 
  } = config;

  // --- DEFINITIONS & FILTERS ---
  const defs = (
    <defs>
      {/* 1. Realistic Fabric Grain */}
      <filter id="fabricGrain" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="4" result="noise" />
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.08 0" in="noise" result="coloredNoise" />
        <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
        <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
      </filter>

      {/* 2. Soft Drop Shadow for Depth */}
      <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
        <feOffset dx="0" dy="8" result="offsetblur" />
        <feComponentTransfer>
           <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge> 
          <feMergeNode />
          <feMergeNode in="SourceGraphic" /> 
        </feMerge>
      </filter>

      {/* 3. Volumetric Gradients */}
      {/* Main Body - Cylindrical Volume */}
      <linearGradient id="volumetricBody" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.6" /> {/* Left Edge Shadow */}
        <stop offset="20%" stopColor="#fff" stopOpacity="0.05" /> {/* Highlight */}
        <stop offset="50%" stopColor="#fff" stopOpacity="0.1" /> {/* Center Highlight */}
        <stop offset="80%" stopColor="#000" stopOpacity="0.1" /> 
        <stop offset="100%" stopColor="#000" stopOpacity="0.6" /> {/* Right Edge Shadow */}
      </linearGradient>

      {/* Sleeve Volume */}
      <linearGradient id="volumetricSleeveLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.5" />
        <stop offset="50%" stopColor="#fff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
      </linearGradient>
       <linearGradient id="volumetricSleeveRight" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.5" />
        <stop offset="50%" stopColor="#fff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
      </linearGradient>

      {/* Inner Neck Depth */}
      <linearGradient id="innerDepth" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
      </linearGradient>

      {/* Collar Shadow */}
      <linearGradient id="collarShadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#000" stopOpacity="0" />
      </linearGradient>
    </defs>
  );

  // --- PATH GEOMETRY ---
  
  // A wider, more athletic fit torso
  const torsoPath = `
    M 140,90 
    Q 120,95 110,105   
    Q 95,140 100,190  
    Q 102,260 105,360 
    L 105,460 
    Q 250,490 395,460
    L 395,360
    Q 398,260 400,190
    Q 405,140 390,105
    Q 380,95 360,90
    L 360,90
    Q 250,110 140,90
    Z
  `;

  const leftSleevePath = `
    M 140,90
    Q 120,95 110,105
    L 40,190
    Q 55,210 90,215
    L 108,200
    L 100,190
    Q 120,160 140,155
    Z
  `;

  const rightSleevePath = `
    M 360,90
    Q 380,95 390,105
    L 460,190
    Q 445,210 410,215
    L 392,200
    L 400,190
    Q 380,160 360,155
    Z
  `;

  // Inner back visible through neck
  const innerBackPath = `
    M 140,88
    Q 250,108 360,88
    L 360,50
    Q 250,70 140,50
    Z
  `;

  const innerNeckPath = `
    M 140,90
    Q 250,110 360,90
    L 360,80
    Q 250,100 140,80
    Z
  `;

  // --- TIPPING RENDERER ---
  const renderTipping = (startX: number, startY: number, endX: number, endY: number, count: number, isCuff = false) => {
    if (count <= 0) return null;
    const lines = [];
    const spacing = 4;
    
    // For cuffs, we draw straight lines between points
    if (isCuff) {
       for(let i=0; i<count; i++) {
           const yOff = (i * spacing) + 2;
           lines.push(
               <path 
                key={i}
                d={`M ${startX},${startY - yOff} L ${endX},${endY - yOff}`}
                stroke={accentColor}
                strokeWidth="2.5"
                opacity="0.9"
               />
           );
       }
    } else {
        // For collar (curved) - handled inside the collar block
    }
    return lines;
  };

  return (
    <svg 
      ref={ref}
      viewBox="0 0 500 600" 
      className={`w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {defs}

      <g filter="url(#softShadow)">
        
        {/* --- INTERIOR --- */}
        <path d={innerBackPath} fill="#111" />
        {/* Label */}
        <rect x="235" y="65" width="30" height="15" fill="#f5f5f5" rx="2" opacity="0.8" />
        <text x="250" y="75" textAnchor="middle" fontSize="6" fontFamily="Arial" fill="#333" fontWeight="bold">NEXUS</text>
        <path d={innerNeckPath} fill={baseColor} filter="brightness(0.6)" />


        {/* --- MAIN BODY --- */}
        <g>
          {/* Base */}
          <path d={torsoPath} fill={baseColor} />
          {/* Texture */}
          <path d={torsoPath} fill="url(#fabricGrain)" opacity="0.5" style={{ mixBlendMode: 'overlay' }} />
          {/* Volume */}
          <path d={torsoPath} fill="url(#volumetricBody)" style={{ mixBlendMode: 'multiply' }} />
          
          {/* Bottom Hem Stitching */}
          <path d="M 105,445 Q 250,475 395,445" fill="none" stroke="black" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
        </g>


        {/* --- SLEEVES --- */}
        <g>
            {/* LEFT SLEEVE */}
            <path d={leftSleevePath} fill={sleeveColor} />
            <path d={leftSleevePath} fill="url(#fabricGrain)" opacity="0.5" style={{ mixBlendMode: 'overlay' }} />
            <path d={leftSleevePath} fill="url(#volumetricSleeveLeft)" style={{ mixBlendMode: 'multiply' }} />
            
            {/* Left Cuff */}
            <path d="M 40,190 L 90,215 L 94,208 L 44,183 Z" fill={collarColor} />
            <path d="M 40,190 L 90,215 L 94,208 L 44,183 Z" fill="black" opacity="0.1" /> {/* Cuff Shadow */}
            {renderTipping(42, 186, 92, 211, tippingLines, true)}

            {/* Inner Sleeve Hole Shadow (Left) */}
            <path d="M 40,190 Q 65,200 90,215 Q 65,205 40,190" fill="black" opacity="0.4" />


            {/* RIGHT SLEEVE */}
            <path d={rightSleevePath} fill={sleeveColor} />
            <path d={rightSleevePath} fill="url(#fabricGrain)" opacity="0.5" style={{ mixBlendMode: 'overlay' }} />
            <path d={rightSleevePath} fill="url(#volumetricSleeveRight)" style={{ mixBlendMode: 'multiply' }} />

            {/* Right Cuff */}
            <path d="M 460,190 L 410,215 L 406,208 L 456,183 Z" fill={collarColor} />
            <path d="M 460,190 L 410,215 L 406,208 L 456,183 Z" fill="black" opacity="0.1" />
            {renderTipping(458, 186, 408, 211, tippingLines, true)}

             {/* Inner Sleeve Hole Shadow (Right) */}
             <path d="M 460,190 Q 435,200 410,215 Q 435,205 460,190" fill="black" opacity="0.4" />
        </g>


        {/* --- CHEST STRIPE --- */}
        {enableChestStripe && (
           <g>
             <path 
               d="M 103,210 Q 250,230 397,210 L 398,240 Q 250,260 104,240 Z" 
               fill={accentColor} 
               opacity="0.95" 
             />
             <path 
               d="M 103,210 Q 250,230 397,210 L 398,240 Q 250,260 104,240 Z" 
               fill="url(#fabricGrain)" 
               style={{ mixBlendMode: 'multiply' }} 
               opacity="0.6"
             />
           </g>
        )}


        {/* --- REALISTIC FOLDS & DRAPE --- */}
        <g style={{ mixBlendMode: 'multiply' }} opacity="0.5">
            {/* Major Drag Lines from Armpits */}
            <path d="M 140,160 Q 180,220 220,280" fill="none" stroke="black" strokeWidth="15" filter="blur(12px)" opacity="0.4" />
            <path d="M 360,160 Q 320,220 280,280" fill="none" stroke="black" strokeWidth="15" filter="blur(12px)" opacity="0.4" />
            
            {/* Waist Bunching */}
            <path d="M 120,400 Q 180,420 240,400" fill="none" stroke="black" strokeWidth="8" filter="blur(8px)" opacity="0.3" />
            <path d="M 380,400 Q 320,420 260,400" fill="none" stroke="black" strokeWidth="8" filter="blur(8px)" opacity="0.3" />

            {/* Center Chest Highlights (to show pecs) */}
            <ellipse cx="190" cy="180" rx="40" ry="30" fill="white" filter="blur(20px)" opacity="0.1" style={{ mixBlendMode: 'screen' }} />
            <ellipse cx="310" cy="180" rx="40" ry="30" fill="white" filter="blur(20px)" opacity="0.1" style={{ mixBlendMode: 'screen' }} />
        </g>


        {/* --- LOGO --- */}
        {logoUrl && (
          <image 
            href={logoUrl} 
            x={300} 
            y={170} 
            height={40 * logoScale} 
            width={40 * logoScale} 
            preserveAspectRatio="xMidYMid meet"
            transform="rotate(-5, 320, 190)"
            style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))' }}
          />
        )}


        {/* --- NECK AREA --- */}
        {type === 'crew' ? (
          <g>
            {/* Back Neck Rib */}
            <path d={`M 140,90 Q 250,${115 + (10 * collarSize)} 360,90`} stroke={collarColor} strokeWidth="14" fill="none" filter="brightness(0.8)" />
            
            {/* Front Neck Rib (Main) */}
            <path 
                d={`M 140,90 Q 250,${115 + (20 * collarSize)} 360,90`} 
                stroke={collarColor} 
                strokeWidth="14" 
                fill="none" 
                strokeLinecap="round"
            />
            
            {/* Ribbing Texture */}
            <path 
                d={`M 140,90 Q 250,${115 + (20 * collarSize)} 360,90`} 
                stroke="white" 
                strokeWidth="14" 
                fill="none" 
                strokeDasharray="2,3" 
                opacity="0.1" 
                style={{ mixBlendMode: 'overlay' }}
            />

            {/* Tipping on Crew */}
            {tippingLines > 0 && Array.from({length: tippingLines}).map((_, i) => {
                 const offset = 4 * (i - (tippingLines-1)/2); // Center lines
                 return (
                    <path 
                        key={i}
                        d={`M 145,95 Q 250,${115 + (20 * collarSize) + offset} 355,95`}
                        stroke={accentColor}
                        strokeWidth="1.5"
                        fill="none"
                    />
                 )
             })}
          </g>
        ) : (
          <g>
             {/* --- POLO PLACKET --- */}
             <defs>
                 <filter id="placketShadow"><feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3"/></filter>
             </defs>
             
             {/* Placket Base */}
             <path d="M 235,90 L 265,90 L 265,240 Q 250,245 235,240 Z" fill={baseColor} filter="url(#placketShadow)" />
             <path d="M 235,90 L 265,90 L 265,240 Q 250,245 235,240 Z" fill="url(#fabricGrain)" opacity="0.5" />
             
             {/* Stitching */}
             <rect x="238" y="230" width="24" height="2" fill="none" stroke="black" strokeWidth="0.5" opacity="0.3" />
             <line x1="238" y1="90" x2="238" y2="230" stroke="black" strokeWidth="0.5" opacity="0.1" />
             <line x1="262" y1="90" x2="262" y2="230" stroke="black" strokeWidth="0.5" opacity="0.1" />

             {/* Buttons */}
             {[120, 160, 200].map((cy, i) => (
                <g key={i} filter="url(#placketShadow)">
                  <circle cx="250" cy={cy} r="6" fill={buttonColor} />
                  <circle cx="250" cy={cy} r="5" fill="none" stroke="black" strokeOpacity="0.1" />
                  <circle cx="248" cy={cy-2} r="2" fill="white" opacity="0.4" />
                  {/* Thread */}
                  <line x1="248" y1={cy} x2="252" y2={cy} stroke="#ccc" strokeWidth="1" />
                  <line x1="250" y1={cy-2} x2="250" y2={cy+2} stroke="#ccc" strokeWidth="1" />
                </g>
             ))}

             {/* --- POLO COLLAR (3D Folded) --- */}
             <g filter="url(#softShadow)">
                 {/* Collar Interior Shadow/Stand */}
                 <path d="M 140,90 Q 250,110 360,90 L 360,100 Q 250,120 140,100 Z" fill="#000" opacity="0.2" />

                 {/* Left Collar Leaf */}
                 <path 
                    d={`M 250,100 L 140,90 Q 110,70 180,110 L 235,160 Q 200,165 145,135 L 140,90`} 
                    fill={collarColor} 
                 />
                 {/* Right Collar Leaf */}
                 <path 
                    d={`M 250,100 L 360,90 Q 390,70 320,110 L 265,160 Q 300,165 355,135 L 360,90`} 
                    fill={collarColor} 
                 />
                 
                 {/* Texture Overlay for Collar */}
                 <path d={`M 250,100 L 140,90 Q 110,70 180,110 L 235,160 Q 200,165 145,135 L 140,90`} fill="url(#fabricGrain)" opacity="0.4" style={{ mixBlendMode: 'multiply' }}/>
                 <path d={`M 250,100 L 360,90 Q 390,70 320,110 L 265,160 Q 300,165 355,135 L 360,90`} fill="url(#fabricGrain)" opacity="0.4" style={{ mixBlendMode: 'multiply' }}/>


                 {/* Tipping on Collar */}
                 {tippingLines > 0 && (
                     <>
                        {Array.from({length: tippingLines}).map((_, i) => {
                             const w = i * 4;
                             return (
                                 <React.Fragment key={i}>
                                    {/* Left Tip */}
                                    <path d={`M 145,135 Q 200,165 235,160`} stroke={accentColor} strokeWidth="2" fill="none" strokeDasharray="0" transform={`translate(0, -${w})`} />
                                    {/* Right Tip */}
                                    <path d={`M 355,135 Q 300,165 265,160`} stroke={accentColor} strokeWidth="2" fill="none" strokeDasharray="0" transform={`translate(0, -${w})`} />
                                 </React.Fragment>
                             )
                        })}
                     </>
                 )}
             </g>
          </g>
        )}

      </g>
    </svg>
  );
});

ShirtSVG.displayName = 'ShirtSVG';

export default ShirtSVG;