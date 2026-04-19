import React from 'react';
import DashboardOverview from '../components/Home/DashboardOverview.jsx';
import StadiumMap from '../components/Map/StadiumMap.jsx';
import SmartRouting from '../components/Navigation/SmartRouting.jsx';
import WaitTimes from '../components/Queues/WaitTimes.jsx';
import FoodOrdering from '../components/Food/FoodOrdering.jsx';
import LiveAlerts from '../components/Home/LiveAlerts.jsx';
import AuthModal from '../components/Auth/AuthModal.jsx';
import { useSocketData } from '../hooks/useSocketData.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useAppContext } from '../context/AppContext.jsx';

const Home = () => {
  const { currentUser, login, isEditingProfile } = useAppContext();
  const { stadiumState, alerts, activeUsers, joinStadium, moveAvatar, isConnected } = useSocketData();

  // Stream hardware GPS directly into the socket backend
  const { error: gpsError } = useGeolocation(!!currentUser, moveAvatar);

  // Auto-join if standard session exists (for localStorage refresh)
  React.useEffect(() => {
     if (currentUser && isConnected && !activeUsers[currentUser.id]) {
        joinStadium(currentUser);
     }
  }, [currentUser, isConnected, joinStadium]);

  const handleJoin = (userData) => {
    login(userData);
    joinStadium(userData);
  };

  if (!stadiumState.zones || Object.keys(stadiumState.zones).length === 0) {
     return <div className="p-8 text-center text-slate-500 animate-pulse">Connecting to Stadium Intelligence Server...</div>;
  }

  return (
    <div className="space-y-6 relative" data-view="attendee">
      {(!currentUser || isEditingProfile) && <AuthModal onJoin={handleJoin} />}
      
      <DashboardOverview globalStats={stadiumState.global} zones={stadiumState.zones} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main interactive map takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          {gpsError && (
             <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                GPS Tracking Error: {gpsError}. Please allow Location Permissions.
             </div>
          )}
          <StadiumMap 
            zones={stadiumState.zones} 
            activeUsers={activeUsers} 
            currentUser={currentUser} 
          />
        </div>
        
        {/* Alerts and Routing take up the third column */}
        <div className="flex flex-col gap-6">
          <LiveAlerts alerts={alerts} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <SmartRouting zones={stadiumState.zones} activeUsers={activeUsers} currentUser={currentUser} />
         <WaitTimes zones={stadiumState.zones} />
         <FoodOrdering />
         
         <div className="glass-panel p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Venue Location</h3>
            <div className="flex-1 min-h-[220px]">
               <iframe
                 src="https://maps.google.com/maps?q=Wembley+Stadium&amp;output=embed"
                 width="100%"
                 height="220"
                 style={{ borderRadius: '12px', border: 0 }}
                 loading="lazy"
                 title="Stadium location map"
                 aria-label="Google Maps showing stadium location"
               ></iframe>
            </div>
            <a 
               href="https://maps.google.com/?q=Wembley+Stadium"
               target="_blank"
               rel="noopener noreferrer"
               className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors flex items-center justify-center text-sm gap-2 text-center"
            >
               Open in Google Maps
            </a>
         </div>
      </div>
    </div>
  );
};

export default Home;
