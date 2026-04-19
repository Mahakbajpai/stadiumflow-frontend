import { useState, useEffect } from 'react';

// Crude haversine-based flat Earth projection for micro-movements (meters)
const measureOffset = (lat1, lon1, lat2, lon2) => {
  // 1 degree latitude = ~111,320 meters
  const dy = (lat2 - lat1) * 111320;
  // 1 degree longitude = ~111,320 * cos(lat) meters
  const dx = (lon2 - lon1) * Math.cos(lat1 * Math.PI / 180) * 111320;
  
  return { dx, dy };
};

export const useGeolocation = (isEnabled, onLocationChange) => {
    const [anchor, setAnchor] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isEnabled || !navigator.geolocation) {
           return;
        }

        const watchId = navigator.geolocation.watchPosition(
           (position) => {
               const { latitude, longitude } = position.coords;

               // Option A: Set the exact place the user opens the app as the 50,50 anchor center
               setAnchor((prevAnchor) => {
                   if (!prevAnchor) {
                       const initial = { lat: latitude, lon: longitude };
                       onLocationChange({ x: 50, y: 50 }); 
                       return initial;
                   }
                   
                   const { dx, dy } = measureOffset(prevAnchor.lat, prevAnchor.lon, latitude, longitude);
                   
                   // Hackathon Amplifier: 1 meter walking = 4% jump on the map so small room paces show up!
                   const AMPLIFIER = 4;
                   
                   // Latitude increases north (UP), CSS Top increases DOWN, so we invert Y
                   let newX = 50 + (dx * AMPLIFIER);
                   let newY = 50 - (dy * AMPLIFIER);

                   // Prevent escaping the stadium walls bounds
                   newX = Math.max(5, Math.min(95, newX));
                   newY = Math.max(5, Math.min(95, newY));

                   onLocationChange({ x: newX, y: newY });
                   return prevAnchor; // Keep the same anchor forever!
               });
           },
           (err) => {
               setError(err.message);
               console.error("GPS Live Tracking Error:", err);
           },
           {
               enableHighAccuracy: true,
               maximumAge: 0,
               timeout: 5000
           }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [isEnabled, onLocationChange]);

    return { error };
};
