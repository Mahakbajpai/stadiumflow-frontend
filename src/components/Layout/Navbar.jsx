import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { RadioReceiver, UserCircle, Settings, Search, Trash2, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.jsx';
import { AvatarSVG } from '../Auth/AuthModal.jsx';

export const sanitizeInput = (str) => {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
};

const Navbar = () => {
  const { 
     currentUser, logout, setIsEditingProfile, 
     searchFriendQuery, setSearchFriendQuery, 
     activeOrders, cancelOrder 
  } = useAppContext();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="glass-panel sticky top-0 z-50 rounded-none border-t-0 border-x-0 border-b border-gray-200/50 flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center shadow-float">
          <RadioReceiver size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">StadiumFlow<span className="text-brand">AI</span></h1>
          <div className="flex items-center gap-2">
             <span className="material-icons text-brand text-[10px] animate-pulse">fiber_manual_record</span>
             <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Live System Active</span>
          </div>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-6 font-medium text-slate-600">
        <NavLink to="/" className={({isActive}) => isActive ? "text-brand" : "hover:text-brand transition-colors"}>Attendee View</NavLink>
        <NavLink to="/admin" className={({isActive}) => isActive ? "text-brand flex items-center gap-1" : "hover:text-brand transition-colors flex items-center gap-1"}>
          <span className="material-icons text-[18px]">dashboard</span> Admin Console
        </NavLink>
      </div>

      <div className="flex items-center gap-4 relative" ref={menuRef}>
        {!currentUser ? (
          <button className="flex items-center justify-center p-2 rounded-full text-slate-400 cursor-not-allowed" aria-label="User profile inactive">
            <UserCircle size={28} />
          </button>
        ) : (
          <>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-1 hover:bg-slate-100 rounded-lg transition-colors p-1"
              aria-label="Open user menu"
            >
              <AvatarSVG color={currentUser.color} styleId={currentUser.styleId} className="w-10 h-10 drop-shadow-sm" />
            </button>

            {isMenuOpen && (
              <div className="absolute top-[120%] right-0 w-80 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in flex flex-col">
                 
                 {/* Header Profile section */}
                 <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                    <AvatarSVG color={currentUser.color} styleId={currentUser.styleId} className="w-14 h-14" />
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg" dangerouslySetInnerHTML={{ __html: sanitizeInput(currentUser.username) }}></h3>
                      <button 
                         onClick={() => { setIsEditingProfile(true); setIsMenuOpen(false); }}
                         className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1 mt-1"
                      >
                         <Settings size={12} /> Edit Profile
                      </button>
                    </div>
                 </div>

                 <div className="p-4 space-y-5">
                    {/* Search Field */}
                    <div>
                       <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Find a Friend</label>
                       <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                             type="text"
                             placeholder="Search username..."
                             value={searchFriendQuery}
                             onChange={(e) => setSearchFriendQuery(e.target.value)}
                             className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                          />
                       </div>
                    </div>

                    {/* Active Orders logic */}
                    <div>
                       <label className="text-[10px] font-bold uppercase text-slate-400 mb-2 block">Active Delivery Orders</label>
                       {activeOrders.length === 0 ? (
                          <p className="text-xs text-slate-500 italic px-1">No pending orders.</p>
                       ) : (
                          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                             {activeOrders.map(order => (
                                <div key={order.id} className="flex flex-col gap-1 p-2 border border-brand-100 bg-brand-50 rounded-lg">
                                   <div className="flex items-center justify-between">
                                      <span className="font-bold text-xs text-slate-700">Order #{order.id}</span>
                                      <button 
                                         onClick={() => cancelOrder(order.id)}
                                         className="text-red-500 hover:text-red-700 p-1"
                                         title="Cancel Order"
                                         aria-label="Cancel order"
                                      >
                                         <Trash2 size={14} />
                                      </button>
                                   </div>
                                   <div className="text-[10px] text-slate-500 flex justify-between">
                                      <span>{order.time}</span>
                                      <span className="font-bold text-brand-600">${order.total.toFixed(2)}</span>
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}
                    </div>
                 </div>

                 {/* Settings / Sign out */}
                 <div className="p-3 bg-slate-50 border-t border-slate-100">
                    <button 
                       onClick={() => { logout(); setIsMenuOpen(false); }}
                       className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                    >
                       <LogOut size={16} /> Sign Out
                    </button>
                 </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
