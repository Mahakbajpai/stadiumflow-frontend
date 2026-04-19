import React from 'react';
import { Timer, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

const WaitTimes = ({ zones }) => {
  // Filter only food and restrooms for queues
  const queueZones = Object.values(zones).filter(z => z.type === 'food' || z.type === 'restroom');

  return (
    <div className="glass-panel p-6">
       <div className="flex items-center gap-3 mb-6">
         <div className="p-2 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center" style={{ width: '36px', height: '36px' }}>
           <span className="material-icons text-[20px]">schedule</span>
         </div>
         <h3 className="text-lg font-bold text-slate-800">Live AI Wait Times</h3>
       </div>

       <div className="space-y-4">
          {queueZones.map(zone => (
             <div key={zone.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div>
                   <h4 className="font-medium text-slate-800 text-sm">{zone.name}</h4>
                   <p className="text-xs text-slate-500 capitalize">{zone.type}</p>
                </div>
                
                <div className="flex items-center gap-3">
                   {/* Trend Indicator Mock */}
                   {zone.status === 'high' ? <TrendingUp size={16} className="text-stadium-high" /> : 
                    zone.status === 'low' ? <TrendingDown size={16} className="text-stadium-low" /> :
                    <Minus size={16} className="text-stadium-medium" />}
                   
                   <div data-waittime="true" className={clsx(
                      "px-3 py-1.5 rounded-lg text-sm font-bold min-w-[70px] text-center shadow-sm",
                      zone.status === 'high' ? 'bg-stadium-high text-white' : 
                      zone.status === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                   )}>
                      {zone.waitTime} m
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default WaitTimes;
