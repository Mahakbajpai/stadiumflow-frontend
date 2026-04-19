import React, { useState } from 'react';
import { Map, Info, Crosshair } from 'lucide-react';
import clsx from 'clsx';
import { AvatarSVG } from '../Auth/AuthModal.jsx';
import { useAppContext } from '../../context/AppContext.jsx';

const zonePositionMap = {
  // Gates
  gateA: { left: '10%', top: '50%' },
  gateB: { left: '50%', top: '10%' },
  gateC: { left: '90%', top: '50%' },
  gateD: { left: '50%', top: '90%' },
  
  // Seating
  seating1: { left: '30%', top: '30%' },
  seating2: { left: '70%', top: '30%' },
  seating3: { left: '30%', top: '70%' },
  seating4: { left: '70%', top: '70%' },

  // Food
  food1: { left: '20%', top: '20%' },
  food2: { left: '80%', top: '20%' },
  food3: { left: '20%', top: '80%' },

  // Restrooms
  restroom1: { left: '50%', top: '25%' },
  restroom2: { left: '50%', top: '75%' },
  restroom3: { left: '85%', top: '80%' },
};

const getStatusColor = (status) => {
  if (status === 'high') return 'bg-stadium-high text-white border-stadium-high shadow-[0_0_15px_rgba(231,76,60,0.5)]';
  if (status === 'medium') return 'bg-stadium-medium text-white border-stadium-medium shadow-[0_0_15px_rgba(243,156,18,0.5)]';
  return 'bg-stadium-low text-white border-stadium-low shadow-[0_0_15px_rgba(46,204,113,0.5)]';
};

const StadiumMap = ({ zones, activeUsers = {}, currentUser }) => {
  const { searchFriendQuery } = useAppContext();
  const [activeZone, setActiveZone] = useState(null);

  const handleZoneClick = (key) => {
    setActiveZone(zones[key]);
  };

  return (
    <div id="stadium-map" className="glass-panel p-6 flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-4">
         <div className="flex items-center gap-3">
           <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
             <Map size={20} />
           </div>
           <h3 className="text-lg font-bold text-slate-800">Live AI Stadium Map</h3>
         </div>
         <div className="flex gap-4 text-xs font-medium text-slate-500">
           <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-stadium-low"></span> Low</div>
           <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-stadium-medium"></span> Med</div>
           <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-stadium-high"></span> High</div>
         </div>
      </div>

      <div className="flex-1 relative bg-slate-50 rounded-xl overflow-hidden border border-slate-200 p-4 relative">
         {/* Field Mock */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/2 border-2 border-brand/20 rounded-[50px] bg-brand/5 flex items-center justify-center pointer-events-none">
            <span className="text-brand-300 font-bold tracking-widest uppercase text-sm">Field</span>
         </div>

         {/* Zone Markers */}
         {Object.keys(zones).map(key => {
            const z = zones[key];
            const pos = zonePositionMap[key];
            if (!pos) return null;

            return (
               <button 
                  key={key}
                  onClick={(e) => { e.stopPropagation(); handleZoneClick(key); }}
                  className={clsx(
                     "absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-110 z-10",
                     getStatusColor(z.status)
                  )}
                  style={{ left: pos.left, top: pos.top }}
               >
                  {z.label || z.name}
               </button>
            )
         })}

         {Object.values(activeUsers).map(user => {
            const isMe = user.username === currentUser?.username;
            const isSearched = searchFriendQuery.length > 1 && user.username.toLowerCase() === searchFriendQuery.toLowerCase();
            
            return (
               <div 
                  key={user.id}
                  className={clsx(
                     "absolute -translate-x-1/2 -translate-y-full transition-all duration-[2000ms] ease-linear z-20 flex flex-col items-center pointer-events-none",
                     isMe ? "z-30 hover:scale-110 hover:z-40" : "",
                     isSearched ? "z-50 scale-125" : ""
                  )}
                  style={{ left: `${user.x}%`, top: `${user.y}%` }}
               >
                  {isMe && (
                     <div className="absolute bottom-[-10px] w-12 h-12 bg-brand-400 rounded-full animate-ping opacity-20 pointer-events-none"></div>
                  )}
                  {isSearched && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-400 rounded-full animate-pulse opacity-40 pointer-events-none blur-md"></div>
                  )}
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm border border-slate-200 mb-1 z-10 relative">
                     <span className={clsx("text-[10px] font-bold", isMe ? "text-brand-600" : isSearched ? "text-yellow-600" : "text-slate-600")}>
                        {user.username}
                     </span>
                  </div>
                  <div className={clsx("relative z-10 rounded-full transition-all", isSearched ? "ring-4 ring-yellow-400 shadow-[0_0_20px_#facc15]" : "")}>
                     <AvatarSVG color={user.color} styleId={user.styleId} className="w-12 h-12" />
                  </div>
                  <div className="w-6 h-1.5 bg-slate-400/30 rounded-[100%] mx-auto mt-[-4px] blur-[1px]"></div>
               </div>
            );
         })}

         {/* Active Zone Detail Overlay */}
         {activeZone && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-200 flex items-start gap-4 animate-fade-in z-40" onClick={e => e.stopPropagation()}>
               <div className="mt-1 text-blue-500"><Info size={24}/></div>
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h4 className="font-bold text-slate-800">{activeZone.name} <span className="text-xs font-normal text-slate-400">({activeZone.type})</span></h4>
                     <button onClick={() => setActiveZone(null)} className="text-slate-400 hover:text-slate-600">×</button>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Density: {activeZone.density}% - Status: <span className="uppercase font-bold" style={{color: activeZone.status === 'high' ? '#E74C3C' : activeZone.status === 'medium' ? '#F39C12' : '#2ECC71'}}>{activeZone.status}</span></p>
                  {activeZone.waitTime !== undefined && (
                     <p className="text-sm text-slate-500">Wait time: <span className="font-bold text-slate-800">{activeZone.waitTime} mins</span></p>
                  )}
                  {activeZone.status === 'high' && (
                     <p className="text-xs text-stadium-high mt-2 font-medium">Suggestion: Consider alternative facilities nearby to avoid queues.</p>
                  )}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default StadiumMap;
