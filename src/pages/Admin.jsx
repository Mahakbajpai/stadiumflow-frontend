import React, { useMemo } from 'react';
import { useSocketData } from '../hooks/useSocketData.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Activity, ShieldAlert, BarChart3, Users, Zap } from 'lucide-react';

const Admin = () => {
  const { stadiumState, alerts, prediction, isConnected } = useSocketData();

  // Prepare chart data from current mock state
  const chartData = useMemo(() => {
    return Object.values(stadiumState.zones).map(z => ({
      name: z.label || z.name.slice(0, 10),
      density: z.density,
      wait: z.waitTime || 0
    })).sort((a, b) => b.density - a.density).slice(0, 7); // Top 7 densest
  }, [stadiumState.zones]);

  const historicalData = useMemo(() => {
    // Generate dynamic historical times relative to current time
    const now = new Date();
    const times = [];
    for(let i=4; i>=0; i--) {
        const d = new Date(now.getTime() - i * 30 * 60000);
        times.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    
    return [
      { time: times[0], attendance: 12000 },
      { time: times[1], attendance: 25000 },
      { time: times[2], attendance: 38000 },
      { time: times[3], attendance: 41000 },
      { time: times[4], attendance: stadiumState.global.totalAttendees },
    ];
  }, [stadiumState.global.totalAttendees]);

  return (
    <div className="space-y-6" data-view="admin">
       <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Command Center Intelligence</h2>
            <p className="text-slate-500 mt-1">Real-time stadium analytics and predictive modeling.</p>
          </div>
          <div className={`px-4 py-2 ${isConnected ? 'bg-brand/10 text-brand-700' : 'bg-red-100 text-red-600'} rounded-lg font-medium flex items-center gap-2`}>
             {isConnected ? <Activity className="animate-pulse" size={18} /> : <Zap size={18} />} 
             {isConnected ? 'System Nominal' : 'Disconnected'}
          </div>
       </div>

       {(!stadiumState.zones || Object.keys(stadiumState.zones).length === 0) ? (
          <div className="text-slate-500 py-12 text-center animate-pulse">Awaiting WebSocket Connection...</div>
       ) : (
          <>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-panel p-4 flex flex-col justify-between">
             <span className="text-xs font-semibold text-slate-500 uppercase">Total Capacity</span>
             <div className="mt-2 text-2xl font-bold text-slate-800">{((stadiumState.global.totalAttendees / stadiumState.global.maxCapacity)*100).toFixed(1)}%</div>
             <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                <div className="bg-brand h-full rounded-full w-[85%]"></div>
             </div>
          </div>
          <div className="glass-panel p-4 flex flex-col justify-between border-b-4 border-b-brand">
             <span className="text-xs font-semibold text-slate-500 uppercase flex items-center justify-between">Avg Processing Time <Activity size={14}/></span>
             <div className="mt-2 text-2xl font-bold text-slate-800">{stadiumState.global.averageWait}s <span className="text-sm font-normal text-slate-400">/ scan</span></div>
          </div>
          <div className="glass-panel p-4 flex flex-col justify-between border-b-4 border-b-yellow-400">
             <span className="text-xs font-semibold text-slate-500 uppercase flex items-center justify-between">Active Alerts <ShieldAlert size={14}/></span>
             <div className="mt-2 text-2xl font-bold text-slate-800">{alerts.length}</div>
          </div>
          <div className="glass-panel p-4 flex flex-col justify-between">
             <span className="text-xs font-semibold text-slate-500 uppercase">Revenue Velocity</span>
             <div className="mt-2 text-2xl font-bold text-slate-800">$1,240 <span className="text-sm font-normal text-slate-400">/ min</span></div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-brand"/> Peak Congestion Zones</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="density" fill="#2ECC71" radius={[4, 4, 0, 0]} name="Density %" />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="glass-panel p-6">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Users size={18} className="text-blue-500"/> Ingress Rate</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5 5'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>

       <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-start justify-between">
             <div>
               <h3 className="font-bold text-lg flex items-center gap-2">AI Predictive Insight</h3>
               <p className="text-slate-300 text-sm mt-2 max-w-2xl">
                  {prediction.nextHotspot ? (
                    <>Based on live streaming socket data, <span className="text-brand-300 font-semibold">{prediction.nextHotspot}</span> is predicted to reach critical congestion in approximately {prediction.expectedIn} minutes.</>
                  ) : (
                    <>Analyzing crowd flow velocity across all connected ingress points...</>
                  )}
               </p>
               <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors shadow-float">Execute Push Notification Re-route</button>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">Dismiss</button>
               </div>
             </div>
             <div className="hidden md:flex p-3 bg-white/10 rounded-xl">
                <Activity size={32} className="text-brand" />
             </div>
          </div>
       </div>
       </>
       )}
    </div>
  );
};

export default Admin;
