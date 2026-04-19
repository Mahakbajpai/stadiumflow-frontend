import React, { useState } from 'react';
import { Navigation, Route, AlertCircle } from 'lucide-react';

const zonePositionMap = {
  seating1: { x: 30, y: 30 },
  seating2: { x: 70, y: 30 },
  seating3: { x: 30, y: 70 },
  seating4: { x: 70, y: 70 },
  food1: { x: 20, y: 20 },
  food2: { x: 80, y: 20 },
  food3: { x: 20, y: 80 },
  restroom1: { x: 50, y: 25 },
  restroom2: { x: 50, y: 75 },
  restroom3: { x: 85, y: 80 },
};

const userPos = { x: 50, y: 95 }; // Fixed starting position near bottom center

const SmartRouting = ({ zones, activeUsers = {}, currentUser }) => {
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRoute = () => {
    if (!destination) return;
    setLoading(true);
    setRoute(null);
    
    // Simulate AI routing calculation
    setTimeout(() => {
       if (destination.startsWith('user_')) {
          const userId = destination.replace('user_', '');
          const destUser = activeUsers[userId];
          if (!destUser) {
             setLoading(false);
             return;
          }
          setRoute({
             id: destination,
             destination: destUser.username,
             time: '3 mins',
             pos: { x: destUser.x, y: destUser.y },
             via: 'Direct Track',
             crowded: false
          });
       } else {
          const destZone = Object.values(zones).find(z => z.id === destination);
          if (!destZone) {
             setLoading(false);
             return;
          }

          // Mock logic finding alternative if crowded
          const isCrowded = destZone.status === 'high';
          let via = 'Concourse A';
          if (isCrowded) {
              via = 'Lower Service Tunnel (AI Re-routed)';
          }

          setRoute({
             id: destination,
             destination: destZone.name,
             time: isCrowded ? '12 mins' : '5 mins',
             pos: zonePositionMap[destination] || { x: 50, y: 50 },
             via: via,
             crowded: isCrowded
          });
       }
       setLoading(false);
    }, 800);
  };

  return (
    <div className="glass-panel p-6 flex flex-col">
       <div className="flex items-center gap-3 mb-6">
         <div className="p-2 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center" style={{ width: '36px', height: '36px' }}>
           <span className="material-icons text-[20px]">directions</span>
         </div>
         <h3 className="text-lg font-bold text-slate-800">Smart Navigation</h3>
       </div>

       <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Where do you want to go?</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="" disabled>Select destination...</option>
              <optgroup label="Seating">
                 <option value="seating1">Section 101-105</option>
                 <option value="seating2">Section 106-110</option>
                 <option value="seating3">Section 101-105 (South)</option>
                 <option value="seating4">Section 106-110 (South)</option>
              </optgroup>
              <optgroup label="Food & Drink">
                 <option value="food1">Burger Arena</option>
                 <option value="food2">Healthy Bowl</option>
                 <option value="food3">Pizza Corner</option>
              </optgroup>
              <optgroup label="Facilities">
                 <option value="restroom1">Restroom North</option>
                 <option value="restroom2">Restroom South</option>
                 <option value="restroom3">Restroom East</option>
              </optgroup>
              {Object.keys(activeUsers).length > 1 && (
                <optgroup label="Other Attendees">
                   {Object.entries(activeUsers)
                     .filter(([id, u]) => u.username !== currentUser?.username)
                     .map(([id, u]) => (
                      <option key={`user_${id}`} value={`user_${id}`}>{u.username}</option>
                   ))}
                </optgroup>
              )}
            </select>
          </div>

          <button 
             onClick={calculateRoute}
             disabled={!destination || loading}
             className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
             {loading ? 'AI Analyzing Paths...' : 'Find Optimal Route'}
          </button>
       </div>

       {route && (
          <div className="mt-6 p-4 bg-brand-50 border border-brand-100 rounded-xl animate-fade-in">
             <div className="flex items-start gap-3">
                <Route className="text-brand-600 mt-0.5 min-w-[20px]" size={20} />
                <div className="w-full">
                   <h4 className="font-bold text-slate-800">Optimal Route Found</h4>
                   <p className="text-sm text-slate-600 mt-1">To <span className="font-medium">{route.destination}</span></p>
                   
                   <div className="flex items-center gap-3 mt-3 text-sm flex-wrap">
                      <span className="bg-white px-2 py-1 rounded shadow-sm font-medium text-slate-700">ETA: {route.time}</span>
                      <span className="text-slate-500">Via {route.via}</span>
                   </div>

                   {route.crowded && (
                      <div className="flex items-center gap-2 mt-3 text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                         <AlertCircle size={14} className="min-w-[14px]" />
                         Destination is currently busy. Route adjusted for least resistance.
                      </div>
                   )}
                   
                   {/* Mini Route Map */}
                   <div className="mt-4 relative bg-[#F8FAFC] rounded-lg h-32 w-full overflow-hidden border border-slate-200">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                         <defs>
                            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                               <stop offset="0%" stopColor="#2ECC71" />
                               <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                         </defs>
                         {/* Ground Field mock */}
                         <rect x="35" y="25" width="30" height="50" rx="15" fill="#e2e8f0" />
                         
                         <path 
                            d={`M ${userPos.x} ${userPos.y} Q 50 50 ${route.pos?.x || 50} ${route.pos?.y || 50}`} 
                            fill="none" 
                            stroke="url(#routeGradient)" 
                            strokeWidth="3.5" 
                            strokeDasharray="4 4" 
                            className="animate-route-dash drop-shadow"
                         />
                         
                         {/* Origin Point */}
                         <circle cx={userPos.x} cy={userPos.y} r="3.5" fill="#3b82f6" />
                         {/* Destination Point */}
                         <circle cx={route.pos?.x || 50} cy={route.pos?.y || 50} r="4" fill="#ef4444" className="animate-pulse" />
                      </svg>
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/80 rounded text-[9px] text-slate-500 font-bold uppercase tracking-wider backdrop-blur-sm border border-slate-200 shadow-sm">AI Active Route</div>
                   </div>
                   
                   <a 
                      href="https://maps.google.com/?q=Wembley+Stadium"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors flex items-center justify-center text-sm"
                   >
                      Get directions in Google Maps
                   </a>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default SmartRouting;
