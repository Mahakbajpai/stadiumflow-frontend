import React, { useMemo } from 'react';
import { Users, Clock, Zap } from 'lucide-react';

const DashboardOverview = ({ globalStats, zones }) => {
  const occupancyPercentage = Math.round((globalStats.totalAttendees / globalStats.maxCapacity) * 100);

  const recommendation = useMemo(() => {
    if (!zones) return null;
    const gates = Object.values(zones).filter(z => z.type === 'gate');
    if (gates.length < 2) return null;
    const sortedGates = [...gates].sort((a, b) => b.density - a.density);
    const busiestGate = sortedGates[0];
    const quietestGate = sortedGates[sortedGates.length - 1];

    if (busiestGate.density > 40) {
      return `System is actively re-routing foot traffic from ${busiestGate.name} to ${quietestGate.name}.`;
    }
    return 'Traffic flow is optimal. No active re-routing needed at this time.';
  }, [zones]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="glass-panel p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
        <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
          <Users size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Attendance</p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-3xl font-bold text-slate-800">{globalStats.totalAttendees.toLocaleString()}</h2>
            <span className="text-sm font-medium text-slate-400 pb-1">/ {globalStats.maxCapacity.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-brand h-full rounded-full" style={{ width: `${occupancyPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg Wait Time</p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-3xl font-bold text-slate-800">{globalStats.averageWait}</h2>
            <span className="text-sm font-medium text-slate-400 pb-1">mins</span>
          </div>
          <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-brand flex items-center"><Zap size={14} /> -2m</span> since last hour
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-float flex flex-col justify-between overflow-hidden relative">
         <div className="relative z-10">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> AI Recommendation Engine</h3>
            <p className="text-sm text-brand-100 mt-2 leading-relaxed">
               {recommendation || "Analyzing stadium traffic patterns..."}
            </p>
         </div>
         <button 
            onClick={() => document.getElementById('stadium-map')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm self-start px-4 py-2 rounded-lg text-sm font-medium transition-colors relative z-10"
         >
            View Traffic Map
         </button>
         <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
         </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
