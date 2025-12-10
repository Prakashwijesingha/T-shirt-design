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

  // --- Filters for Realism ---
  const defs = (
    <defs>
      {/* 1. Fabric Texture (Pique/Jersey) */}
      <filter id="fabricTexture" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.04 0" in="noise" result="coloredNoise" />
        <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
        <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
      </filter>

      {/* 2. Ribbed Texture for Collars/Cuffs */}
      <pattern id="ribPattern" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
         <line x1="0" y1="0" x2="0" y2="4" stroke="black" strokeWidth="1" opacity="0.1" />
      </pattern>

      {/* 3. Deep Drop Shadow */}
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
        <feOffset dx="0" dy="8" result="offsetblur" />
        <feComponentTransfer>
           <feFuncA type="linear" slope="0.2"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* 4. Inner Shadow for depth */}
      <filter id="innerDepth">
        <feOffset dx="0" dy="2" />
        <feGaussianBlur stdDeviation="2" result="offset-blur" />
        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
        <feFlood floodColor="black" floodOpacity="0.25" result="color" />
        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
      </filter>
    </defs>
  );

  // --- 3D Geometry Paths (Based on provided mockups) ---

  // Main Torso - Tapered fit
  const torsoPath = "M115,70 L90,135 L95,460 Q200,475 305,460 L310,135 L285,70 Q200,85 115,70 Z";

  // Sleeves - Angled naturally
  const leftSleeveBase = "M115,70 L40,150 L75,180 L110,140 L115,70 Z";
  const rightSleeveBase = "M285,70 L360,150 L325,180 L290,140 L285,70 Z";

  // Chest Stripe Path (Curved to match chest volume)
  // Located just below the placket/collar area
  const chestStripePath = "M113,180 Q200,200 287,180 L288,195 Q200,215 112,195 Z";

  // --- Shading Layers (The "3D" effect) ---
  
  const leftSideShadow = "M90,135 L95,460 Q120,460 120,135 Z";
  const rightSideShadow = "M310,135 L305,460 Q280,460 280,135 Z";
  const leftArmpitShadow = "M112,140 Q105,160 125,155 L112,140 Z";
  const rightArmpitShadow = "M288,140 Q295,160 275,155 L288,140 Z";

  const fold1 = "M130,200 Q200,220 270,200 L260,240 Q200,260 140,240 Z"; 
  const fold2 = "M110,380 Q150,420 200,390"; 
  const fold3 = "M290,380 Q250,420 200,390"; 
  const verticalFold = "M150,300 Q160,380 150,450";

  const chestHighlight = "M140,140 Q200,120 260,140 Q270,250 200,260 Q130,250 140,140 Z";
  const shoulderHighlightLeft = "M115,70 L40,150 L50,150 L120,75 Z";
  const shoulderHighlightRight = "M285,70 L360,150 L350,150 L280,75 Z";

  // --- Dynamic Component Calculations ---

  // Polo Collar Logic
  const collarSpread = 60 * collarSize;
  const leftTip = 200 - collarSpread;
  const rightTip = 200 + collarSpread;
  const collarHeight = 125 + (10 * (collarSize - 1));

  // Outer edge paths for tipping
  const poloCollarLeft = `M115,70 Q100,55 ${leftTip},85 L115,${collarHeight} Q157,${collarHeight + 5} 200,${130 + (5 * (collarSize-1))} L200,85 Q157,100 115,70 Z`;
  const poloCollarRight = `M285,70 Q300,55 ${rightTip},85 L285,${collarHeight} Q243,${collarHeight + 5} 200,${130 + (5 * (collarSize-1))} L200,85 Q243,100 285,70 Z`;
  
  const placketPath = "M185,85 L215,85 L215,210 Q200,215 185,210 Z";

  // Cuff Logic
  const cuffWidth = 15;
  const leftCuffPath = `M40,150 L75,180 L${75 + cuffWidth},${180 - cuffWidth} L${40 + cuffWidth},${150 - cuffWidth} Z`;
  const rightCuffPath = `M360,150 L325,180 L${325 - cuffWidth},${180 - cuffWidth} L${360 - cuffWidth},${150 - cuffWidth} Z`;

  // Crew Neck Logic
  const ribWidth = 12 * collarSize;
  const crewNeckPath = `M115,70 Q200,115 285,70 Q200,${115 + ribWidth} 115,70 Z`;
  
  // --- Tipping Generation Helpers ---

  // Crew Neck Tipping Generator
  const renderCrewTipping = () => {
    const lines = [];
    for (let i = 1; i <= tippingLines; i++) {
      // Calculate interpolation ratio based on number of lines
      // For 1 line: ratio 0.5 (middle)
      // For 2 lines: 0.33, 0.66
      // For 3 lines: 0.25, 0.5, 0.75
      const ratio = i / (tippingLines + 1);
      const currentWidth = ribWidth * ratio;
      
      lines.push(
        <path 
          key={i}
          d={`M115,70 Q200,${115 + currentWidth} 285,70`} 
          stroke={accentColor} 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.9"
        />
      );
    }
    return lines;
  };

  // Polo Cuff Tipping Generator
  const renderCuffTipping = (startX: number, startY: number, endX: number, endY: number, width: number) => {
    const lines = [];
    for (let i = 1; i <= tippingLines; i++) {
      const ratio = i / (tippingLines + 1);
      // Interpolate points between top edge and bottom edge of cuff
      const sX = startX + width * ratio;
      const sY = startY - width * ratio;
      const eX = endX + width * ratio;
      const eY = endY - width * ratio;

      lines.push(
        <line 
          key={i}
          x1={sX} y1={sY} 
          x2={eX} y2={eY} 
          stroke={accentColor} 
          strokeWidth="1.5"
          opacity="0.9"
        />
      );
    }
    return lines;
  };

  // Polo Collar Tipping Generator
  // Uses slight transforms to create parallel lines
  const renderCollarTipping = (path: string, side: 'left' | 'right') => {
    const lines = [];
    for (let i = 0; i < tippingLines; i++) {
      // Line 1: Edge
      // Line 2: Slightly inset
      // Line 3: More inset
      const inset = i * 2.5;
      // Inset direction varies by side
      const xOffset = side === 'left' ? inset : -inset;
      const yOffset = inset;
      
      lines.push(
        <path 
          key={i}
          d={path} 
          stroke={accentColor} 
          strokeWidth="1.5" 
          fill="none" 
          transform={`translate(${xOffset}, ${yOffset}) scale(${1 - (i*0.01)})`}
        />
      );
    }
    return lines;
  };

  return (
    <svg 
      ref={ref}
      viewBox="0 0 400 500" 
      className={`w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      filter="url(#dropShadow)"
    >
      {defs}

      {/* Apply Base Texture */}
      <g filter="url(#fabricTexture)">
        
        {/* --- Back Neck Area --- */}
        <path d="M115,70 Q200,115 285,70" fill="#1e1e1e" />
        <image 
            href="https://img.freepik.com/premium-photo/gray-t-shirt-label-tag-mockup_1158030-221.jpg" 
            x="180" y="75" width="40" height="20" opacity="0.6" 
        />

        {/* --- Sleeves --- */}
        <path d={leftSleeveBase} fill={sleeveColor} />
        <path d={rightSleeveBase} fill={sleeveColor} />

        {/* --- Torso --- */}
        <path d={torsoPath} fill={baseColor} />

        {/* --- Chest Stripe (Optional) --- */}
        {enableChestStripe && (
          <path d={chestStripePath} fill={accentColor} style={{ mixBlendMode: 'multiply' }} opacity="0.9" />
        )}

        {/* --- Realistic Shadows & Highlights --- */}
        <path d={leftSideShadow} fill="black" opacity="0.2" filter="blur(5px)" />
        <path d={rightSideShadow} fill="black" opacity="0.2" filter="blur(5px)" />
        <path d={leftArmpitShadow} fill="black" opacity="0.3" filter="blur(3px)" />
        <path d={rightArmpitShadow} fill="black" opacity="0.3" filter="blur(3px)" />
        <path d={chestHighlight} fill="white" opacity="0.12" filter="blur(15px)" />
        <path d={shoulderHighlightLeft} fill="white" opacity="0.15" filter="blur(4px)" />
        <path d={shoulderHighlightRight} fill="white" opacity="0.15" filter="blur(4px)" />

        <path d={fold1} fill="black" opacity="0.05" filter="blur(8px)" />
        <path d={fold2} fill="none" stroke="black" strokeWidth="3" opacity="0.05" filter="blur(2px)" />
        <path d={fold3} fill="none" stroke="black" strokeWidth="3" opacity="0.05" filter="blur(2px)" />
        <path d={verticalFold} fill="none" stroke="black" strokeWidth="4" opacity="0.03" filter="blur(4px)" />

        {/* --- Logo Rendering --- */}
        {logoUrl && (
          <image 
            href={logoUrl} 
            x={245} 
            y={150} 
            height={40 * logoScale} 
            width={40 * logoScale} 
            preserveAspectRatio="xMidYMid meet"
            transform="rotate(-5, 265, 170) skewY(5)"
            style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))' }}
          />
        )}

        {/* --- Crew Neck Specifics --- */}
        {type === 'crew' && (
          <g>
            <path d={crewNeckPath} fill={collarColor} filter="url(#innerDepth)" />
            <path d={crewNeckPath} fill="url(#ribPattern)" opacity="0.3" />
            
            {/* Crew Neck Tipping */}
            {tippingLines > 0 && renderCrewTipping()}
            
            <path d="M45,148 L80,178" stroke="black" strokeWidth="1" strokeDasharray="3,2" opacity="0.2" />
            <path d="M355,148 L320,178" stroke="black" strokeWidth="1" strokeDasharray="3,2" opacity="0.2" />
            <path d="M100,450 Q200,465 300,450" stroke="black" strokeWidth="1" strokeDasharray="3,2" opacity="0.2" />
          </g>
        )}

        {/* --- Polo Specifics --- */}
        {type === 'polo' && (
          <g>
             {/* Cuffs */}
             <path d={leftCuffPath} fill={collarColor} filter="url(#innerDepth)" />
             <path d={leftCuffPath} fill="url(#ribPattern)" opacity="0.3" />
             {/* Left Cuff Tipping */}
             {tippingLines > 0 && renderCuffTipping(40, 150, 75, 180, cuffWidth)}

             <path d={rightCuffPath} fill={collarColor} filter="url(#innerDepth)" />
             <path d={rightCuffPath} fill="url(#ribPattern)" opacity="0.3" />
             {/* Right Cuff Tipping */}
             {tippingLines > 0 && renderCuffTipping(360, 150, 325, 180, -cuffWidth)}

             {/* Placket */}
             <path d={placketPath} fill={baseColor} filter="url(#innerDepth)" />
             <rect x="188" y="200" width="24" height="8" fill="none" stroke="black" strokeWidth="0.5" opacity="0.3" />

             {/* Buttons */}
             {[105, 145, 185].map((cy, i) => (
                <g key={i} transform={`translate(0, ${i * 2})`}>
                  <circle cx="200" cy={cy} r="5" fill="black" opacity="0.3" />
                  <circle cx="200" cy={cy} r="5" fill={buttonColor} />
                  <circle cx="200" cy={cy} r="4" fill="none" stroke="black" strokeOpacity="0.1" />
                  <circle cx="198" cy={cy-2} r="2" fill="white" opacity="0.5" />
                  <circle cx="199" cy={cy} r="0.5" fill="black" opacity="0.5" />
                  <circle cx="201" cy={cy} r="0.5" fill="black" opacity="0.5" />
                </g>
             ))}

             {/* Collar */}
             <g filter="url(#dropShadow)">
                <path d={poloCollarLeft} fill={collarColor} />
                <path d={poloCollarLeft} fill="url(#ribPattern)" opacity="0.1" />
                {tippingLines > 0 && renderCollarTipping(poloCollarLeft, 'left')}
                
                <path d={poloCollarRight} fill={collarColor} />
                <path d={poloCollarRight} fill="url(#ribPattern)" opacity="0.1" />
                {tippingLines > 0 && renderCollarTipping(poloCollarRight, 'right')}
             </g>
             
             <path d="M115,70 Q200,90 285,70 L200,95 Z" fill="black" opacity="0.2" />
          </g>
        )}

      </g>
    </svg>
  );
});

ShirtSVG.displayName = 'ShirtSVG';

export default ShirtSVG;