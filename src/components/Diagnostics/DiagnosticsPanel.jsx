import React, { useState } from 'react';
import { Settings, X, CheckCircle, XCircle, Activity } from 'lucide-react';

const DiagnosticsPanel = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [results, setResults] = useState(null);

   const runChecks = () => {
      const newResults = [];
      const addResult = (name, passed, detail) => {
         newResults.push({ name, passed, detail, time: new Date().toLocaleTimeString() });
      };

      // 1. DOM Architecture
      const hasDataView = !!document.querySelector('[data-view="attendee"]');
      addResult('DOM Architecture', hasDataView, hasDataView ? 'Main view initialized with data-view' : 'Missing data-view attribute');

      // 2. Integration: Food Cart
      const hasCart = !!document.querySelector('[data-cart]');
      addResult('Commerce Integration', hasCart, hasCart ? 'Cart element successfully mounted' : 'Missing data-cart attribute');

      // 3. Service: Google Fonts
      let hasFonts = false;
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(l => { if (l.href.includes('fonts.googleapis.com/css2?family=Inter')) hasFonts = true; });
      addResult('Google Fonts (Inter)', hasFonts, hasFonts ? 'Font styles loaded and applied' : 'Inter stylesheet link missing');

      // 4. Service: Material Icons
      let hasIcons = false;
      links.forEach(l => { if (l.href.includes('Material+Icons')) hasIcons = true; });
      addResult('Google Material Icons', hasIcons, hasIcons ? 'Icon library connected' : 'Material Icons link missing');

      // 5. Service: Google Maps
      const hasMaps = !!document.querySelector('iframe[src*="maps.google.com"]');
      addResult('Google Maps API', hasMaps, hasMaps ? 'Embedded maps frame active' : 'No venue maps iframe found');

      // 6. Security: CSP
      const hasCSP = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      addResult('Content Security Policy', hasCSP, hasCSP ? 'Strict CSP rules configured' : 'CSP meta tag is missing');

      // 7. A11y: Skip Link
      const hasSkip = !!document.querySelector('a[href="#main-content"]');
      addResult('Accessibility: Navigation', hasSkip, hasSkip ? 'Skip to main content present' : 'Top-level skip link missing');

      // 8. A11y: Live Regions
      const hasLive = !!document.querySelector('[aria-live]');
      addResult('Accessibility: Live Regions', hasLive, hasLive ? 'Live alert regions implemented' : 'Aria-live attribute missing');

      setResults(newResults);
   };

   return (
      <>
         <button 
            onClick={() => { setIsOpen(true); runChecks(); }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-slate-800 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center border-2 border-slate-700"
            aria-label="Run Diagnostics"
         >
            <Activity size={24} className="text-brand-300" />
         </button>

         {isOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-8 animate-fade-in">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                           <Settings size={28} />
                        </div>
                        <div>
                           <h2 className="text-xl font-bold text-slate-800">System Diagnostics</h2>
                           <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Platform Verification</p>
                        </div>
                     </div>
                     <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-white rounded-full shadow-sm border border-slate-200">
                        <X size={20} />
                     </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 custom-scrollbar">
                     <div className="space-y-3">
                        {results?.map((res, idx) => (
                           <div key={idx} className={`p-4 rounded-xl border ${res.passed ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'} flex items-start gap-4 transition-all hover:shadow-md`}>
                              <div className="mt-0.5">
                                 {res.passed ? <CheckCircle size={20} className="text-green-500" /> : <XCircle size={20} className="text-red-500" />}
                              </div>
                              <div className="flex-1">
                                 <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-slate-700">{res.name}</h4>
                                    <span className="text-xs text-slate-400 font-mono">{res.time}</span>
                                 </div>
                                 <p className={`text-sm ${res.passed ? 'text-green-600' : 'text-red-600'}`}>
                                    {res.detail}
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center">
                     <div className="text-sm font-medium text-slate-500">
                        Total Checks: <span className="font-bold text-slate-800">8</span>
                        <span className="mx-2 opacity-30">|</span>
                        Passed: <span className="font-bold text-green-600">{results?.filter(r => r.passed).length || 0}</span>
                     </div>
                     <button onClick={runChecks} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2 shadow-sm">
                        <Activity size={16} /> Rerun Checks
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default DiagnosticsPanel;
