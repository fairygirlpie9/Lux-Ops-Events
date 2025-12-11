import React, { useState, useRef, useEffect } from 'react';
import { FloorItem, FurnitureType } from '../types';
import { Users, AlertTriangle, Move, Info } from 'lucide-react';

interface FloorPlanProps {
  items: FloorItem[];
  setItems: React.Dispatch<React.SetStateAction<FloorItem[]>>;
  showHeatmap: boolean;
  showCompliance: boolean;
}

const FloorPlan: React.FC<FloorPlanProps> = ({ items, setItems, showHeatmap, showCompliance }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Simple drag logic
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingId(id);
    setSelectedItem(id);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !svgRef.current) return;

    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return;

    const x = (e.clientX - CTM.e) / CTM.a;
    const y = (e.clientY - CTM.f) / CTM.d;

    setItems((prev) =>
      prev.map((item) =>
        item.id === draggingId ? { ...item, x, y } : item
      )
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDraggingId(null);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  // Helper to check compliance (simple distance check)
  const isTooClose = (currentItem: FloorItem) => {
    if (!showCompliance) return false;
    // Check against all other items
    return items.some((other) => {
      if (other.id === currentItem.id) return false;
      const dx = currentItem.x - other.x;
      const dy = currentItem.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Arbitrary threshold for "too close" - 80 units
      return dist < 80;
    });
  };

  return (
    <div className="relative w-full h-full bg-[#FAFAF9] overflow-hidden select-none">
      {/* Subtle Texture Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p5.png")' }}
      ></div>
      {/* Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]" 
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}
      ></div>

      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        className="w-full h-full touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Heatmap Overlay */}
        {showHeatmap && (
           <g className="opacity-30 pointer-events-none filter blur-3xl mix-blend-multiply">
              {items.map((item) => (
                <circle key={`heat-${item.id}`} cx={item.x} cy={item.y} r={140} fill={item.assignedStaff ? "#ef4444" : "#3b82f6"} />
              ))}
           </g>
        )}

        {items.map((item) => {
          const complianceWarning = isTooClose(item);
          const isSelected = selectedItem === item.id;
          
          return (
            <g
              key={item.id}
              transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation})`}
              onPointerDown={(e) => handlePointerDown(item.id, e)}
              className="cursor-move transition-transform duration-75"
              style={{ filter: isSelected ? 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }}
            >
              {/* Visual Selection Ring */}
              {isSelected && (
                <circle r="60" className="fill-none stroke-amber-500 stroke-1 opacity-50" strokeDasharray="4 4" />
              )}

              {/* Furniture Shapes */}
              {item.type === FurnitureType.TABLE_ROUND && (
                <>
                  <circle r="42" className="fill-white stroke-stone-300 stroke-1" />
                  <circle r="34" className="fill-[#F5F5F4] stroke-none" />
                  {/* Chairs */}
                  {[...Array(8)].map((_, i) => (
                    <circle 
                      key={i} 
                      cx={Math.cos((i * Math.PI) / 4) * 54} 
                      cy={Math.sin((i * Math.PI) / 4) * 54} 
                      r="5" 
                      className="fill-stone-400"
                    />
                  ))}
                </>
              )}
              {item.type === FurnitureType.TABLE_RECT && (
                <rect x="-50" y="-30" width="100" height="60" rx="2" className="fill-white stroke-stone-300 stroke-1" />
              )}
              {item.type === FurnitureType.DANCE_FLOOR && (
                <rect x="-80" y="-80" width="160" height="160" className="fill-stone-900 stroke-stone-700 stroke-4 opacity-10" />
              )}
              {item.type === FurnitureType.ENTRANCE && (
                 <path d="M-30,-20 L30,-20 L30,20 L-30,20" fill="none" className="stroke-green-600 stroke-[3] opacity-50" />
              )}

              {/* Label */}
              <text y="5" className="text-[9px] font-serif font-bold fill-stone-700 text-center pointer-events-none tracking-widest" textAnchor="middle">
                {item.label}
              </text>

              {/* Compliance Warning */}
              {complianceWarning && (
                <g transform="translate(25, -45)">
                   <circle r="14" className="fill-red-600 animate-pulse shadow-sm" />
                   <text y="5" x="-5" className="fill-white font-bold text-sm">!</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Item Detail Popover */}
      {selectedItem && (() => {
        const item = items.find(i => i.id === selectedItem);
        if (!item) return null;
        return (
          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md border border-stone-200 p-5 rounded-sm shadow-xl w-72 animate-fade-in ring-1 ring-black/5">
             <div className="flex justify-between items-start mb-3 border-b border-stone-100 pb-2">
                <h3 className="font-serif font-bold text-stone-900 flex items-center gap-2 text-lg">
                   {item.label}
                </h3>
                <button onClick={() => setSelectedItem(null)} className="text-stone-400 hover:text-stone-900 transition-colors">×</button>
             </div>
             <div className="space-y-3 text-sm text-stone-600">
                {item.guests && <p className="flex items-center gap-2 font-light"><Users size={14} className="text-stone-400"/> {item.guests} Seated Guests</p>}
                {item.assignedStaff && <p className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wide">
                   <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                   Staff: {item.assignedStaff}
                </p>}
                {isTooClose(item) && (
                  <div className="flex items-start gap-3 text-red-800 bg-red-50 p-3 rounded-sm border border-red-100">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-600" />
                    <span className="text-xs font-medium leading-relaxed">Compliance Violation: Insufficient egress clearance detected. Relocate immediately.</span>
                  </div>
                )}
             </div>
          </div>
        );
      })()}

       {/* Legend / Overlay Toggles hint */}
       <div className="absolute bottom-6 left-6 flex gap-3 pointer-events-none">
          {showHeatmap && <div className="bg-stone-900 text-amber-50 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-lg">Heatmap: Active</div>}
          {showCompliance && <div className="bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-lg">Safety Check: Active</div>}
       </div>
    </div>
  );
};

export default FloorPlan;