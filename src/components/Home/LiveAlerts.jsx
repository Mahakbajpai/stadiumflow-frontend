import React from 'react';
import { BellRing, ShieldAlert, CheckCircle2 } from 'lucide-react';

const LiveAlerts = ({ alerts }) => {
  return (
    <div className="glass-panel p-6 mb-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center" style={{ width: '36px', height: '36px' }}>
          <span className="material-icons text-[20px]">notifications_active</span>
        </div>
        <h3 className="text-lg font-bold text-slate-800">Live AI Alerts</h3>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2" aria-live="polite" aria-label="Live congestion alerts">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
            <CheckCircle2 size={32} className="mb-2 text-stadium-low" />
            <p className="text-sm">All operations running smoothly.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} data-alert-item="true" role={alert.type === 'critical' ? 'alert' : undefined} className="p-4 rounded-xl border border-yellow-200/50 bg-yellow-50/50 flex items-start gap-3 animate-fade-in">
              <ShieldAlert size={18} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-800">{alert.message}</p>
                <span className="text-xs text-slate-500 mt-1 block">
                  {(() => {
                     const alertTime = new Date(alert.time).getTime();
                     if (isNaN(alertTime)) return alert.time;
                     
                     const diffMins = Math.floor((Date.now() - alertTime) / 60000);
                     if (diffMins < 1) return 'Just now';
                     if (diffMins < 60) return `${diffMins}m ago`;
                     
                     return new Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  })()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveAlerts;
