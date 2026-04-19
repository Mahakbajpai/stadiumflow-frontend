import React, { useState, useEffect } from 'react';
import { User, Sparkles, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '../../context/AppContext.jsx';

const AVATAR_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#8b5cf6', // Purple
  '#f59e0b', // Yellow/Orange
  '#ec4899', // Pink
];

const AVATAR_STYLES = [
  { id: 'none', label: 'Basic' },
  { id: 'glasses', label: 'Glasses' },
  { id: 'hat', label: 'Cap' },
  { id: 'tie', label: 'Tie' },
  { id: 'bow', label: 'Bow Tie' },
];

export const AvatarSVG = ({ color, styleId, className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={clsx("drop-shadow-md", className)}>
    <circle cx="50" cy="50" r="45" fill={color} />
    {/* Head */}
    <circle cx="50" cy="40" r="18" fill="rgba(255,255,255,0.95)" />
    {/* Body */}
    <path d="M 25 80 Q 50 40 75 80" fill="rgba(255,255,255,0.8)" />
    
    {/* Accessories */}
    {styleId === 'glasses' && (
      <g fill="none" stroke="#222" strokeWidth="3">
        <rect x="36" y="35" width="12" height="8" rx="2" />
        <rect x="52" y="35" width="12" height="8" rx="2" />
        <path d="M 48 39 L 52 39" />
        <path d="M 36 39 L 28 35" />
        <path d="M 64 39 L 72 35" />
      </g>
    )}
    {styleId === 'hat' && (
      <g>
        <path d="M 20 30 Q 50 15 80 30 Z" fill="#222" />
        <path d="M 20 30 Q 50 35 80 30" fill="none" stroke="#222" strokeWidth="4" />
        <rect x="35" y="27" width="30" height="4" fill="#666" />
      </g>
    )}
    {styleId === 'tie' && (
      <g>
        <path d="M 46 55 L 54 55 L 52 65 L 56 80 L 50 90 L 44 80 L 48 65 Z" fill="#222" />
        <path d="M 44 55 Q 50 60 56 55 Z" fill="#444" />
      </g>
    )}
    {styleId === 'bow' && (
      <g>
        <circle cx="50" cy="58" r="4" fill="#222" />
        <path d="M 50 58 L 35 52 L 35 64 Z" fill="#e11d48" />
        <path d="M 50 58 L 65 52 L 65 64 Z" fill="#e11d48" />
      </g>
    )}
  </svg>
);

const AuthModal = ({ onJoin }) => {
  const { currentUser } = useAppContext() || {};
  const [username, setUsername] = useState(currentUser?.username || '');
  const [color, setColor] = useState(currentUser?.color || AVATAR_COLORS[0]);
  const [styleId, setStyleId] = useState(currentUser?.styleId || 'none');

  const handleJoin = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    onJoin({ username, color, styleId });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full max-h-[95vh] rounded-3xl shadow-2xl overflow-y-auto animate-fade-in border border-white/20 custom-scrollbar">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-center relative overflow-hidden shrink-0">
           <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
             <MapPin size={80} />
           </div>
           <h2 className="text-2xl font-bold text-white relative z-10">Snap Map Live</h2>
           <p className="text-brand-100 mt-1 text-sm relative z-10">{currentUser ? 'Update your Snap Map avatar.' : 'Create your avatar and drop into the stadium.'}</p>
        </div>

        <form onSubmit={handleJoin} className="p-6 space-y-5">
           {/* Avatar Preview */}
           <div className="flex flex-col items-center justify-center pt-2">
              <AvatarSVG color={color} styleId={styleId} className="w-24 h-24" />
              <div className="w-16 h-2 bg-slate-200/50 rounded-[100%] mt-1 blur-[2px]"></div>
           </div>

           {/* Name Input */}
           <div>
              <label className="text-sm font-bold text-slate-700 block mb-2 uppercase tracking-wider">Display Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  maxLength={15}
                  required
                  placeholder="e.g. MapExplorer99"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all font-medium"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
           </div>

           {/* Customization Grid */}
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="text-xs font-bold text-slate-500 block mb-3 uppercase">Avatar Color</label>
                 <div className="flex flex-wrap gap-2">
                    {AVATAR_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={clsx(
                          "w-8 h-8 rounded-full transition-transform",
                          color === c ? "ring-2 ring-offset-2 ring-slate-800 scale-110 shadow-md" : "hover:scale-110"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                 </div>
              </div>
              
              <div>
                 <label className="text-xs font-bold text-slate-500 block mb-3 uppercase">Accessory</label>
                 <div className="flex flex-col gap-2">
                    {AVATAR_STYLES.map(s => (
                       <button
                         key={s.id}
                         type="button"
                         onClick={() => setStyleId(s.id)}
                         className={clsx(
                           "text-xs font-medium px-3 py-1.5 rounded-lg border transition-all text-left",
                           styleId === s.id ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                         )}
                       >
                         {s.label}
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           <button 
             type="submit"
             disabled={!username.trim()}
             className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl font-bold text-lg shadow-float transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
           >
             <Sparkles size={20} className="group-hover:animate-spin" /> {currentUser ? 'Save Changes' : 'Drop In'}
           </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
