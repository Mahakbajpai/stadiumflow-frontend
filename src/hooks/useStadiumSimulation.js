import { useState, useEffect } from 'react';

// Central state for the entire simulated stadium
const INITIAL_STADIUM_STATE = {
  zones: {
    gateA: { id: 'gateA', name: 'Main Gate A', density: 30, status: 'low', type: 'gate' },
    gateB: { id: 'gateB', name: 'West Gate B', density: 60, status: 'medium', type: 'gate' },
    gateC: { id: 'gateC', name: 'VIP Gate C', density: 10, status: 'low', type: 'gate' },
    gateD: { id: 'gateD', name: 'East Gate D', density: 85, status: 'high', type: 'gate' },
    
    seating1: { id: 'seating1', name: 'Section 101-105', density: 40, status: 'low', type: 'seating' },
    seating2: { id: 'seating2', name: 'Section 106-110', density: 75, status: 'medium', type: 'seating' },
    seating3: { id: 'seating3', name: 'Section 111-115', density: 95, status: 'high', type: 'seating' },
    seating4: { id: 'seating4', name: 'Section 116-120', density: 20, status: 'low', type: 'seating' },

    food1: { id: 'food1', name: 'Burger Arena', density: 80, status: 'high', waitTime: 25, type: 'food' },
    food2: { id: 'food2', name: 'Healthy Bowl', density: 30, status: 'low', waitTime: 5, type: 'food' },
    food3: { id: 'food3', name: 'Pizza Corner', density: 55, status: 'medium', waitTime: 12, type: 'food' },

    restroom1: { id: 'restroom1', name: 'Restroom North', density: 45, status: 'low', waitTime: 3, type: 'restroom' },
    restroom2: { id: 'restroom2', name: 'Restroom South', density: 85, status: 'high', waitTime: 15, type: 'restroom' },
    restroom3: { id: 'restroom3', name: 'Restroom East', density: 60, status: 'medium', waitTime: 8, type: 'restroom' },
  },
  global: {
    totalAttendees: 42500,
    maxCapacity: 50000,
    averageWait: 12,
  },
  alerts: []
};

function determineStatus(density) {
  if (density < 50) return 'low';
  if (density < 75) return 'medium';
  return 'high';
}

function randomFluctuation(current, maxDiff) {
  const diff = Math.floor(Math.random() * (maxDiff * 2 + 1)) - maxDiff;
  const meanReversion = (50 - current) * 0.05;
  let next = current + diff + meanReversion;
  if (next < 5) next = 5;
  if (next > 100) next = 100;
  return Math.floor(next);
}

export function useStadiumSimulation() {
  const [stadiumState, setStadiumState] = useState(INITIAL_STADIUM_STATE);

  useEffect(() => {
    // Heartbeat simulation updates every 3 seconds
    const interval = setInterval(() => {
      setStadiumState(prev => {
        const newZones = { ...prev.zones };
        let newAlerts = [...prev.alerts];
        
        // Fluctuate densities and wait times slightly
        Object.keys(newZones).forEach(key => {
          const zone = newZones[key];
          const newDensity = randomFluctuation(zone.density, 5);
          zone.density = newDensity;
          zone.status = determineStatus(newDensity);
          
          if (zone.waitTime !== undefined) {
             const baseWait = Math.floor(newDensity / 4);
             zone.waitTime = Math.max(1, randomFluctuation(baseWait, 2));
          }
        });

        // Trigger dynamic alerts based on high densities
        const highZones = Object.values(newZones).filter(z => z.status === 'high' && Math.random() > 0.8);
        if (highZones.length > 0) {
          const zone = highZones[Math.floor(Math.random() * highZones.length)];
          const newAlert = {
            id: Date.now(),
            message: `High congestion at ${zone.name}. Expect delays.`,
            type: 'warning',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          newAlerts = [newAlert, ...newAlerts].slice(0, 5); // Keep last 5
        }

        return {
          ...prev,
          zones: newZones,
          alerts: newAlerts,
          global: {
            ...prev.global,
            averageWait: Math.floor(
              Object.values(newZones)
                .filter(z => z.waitTime !== undefined)
                .reduce((acc, z) => acc + z.waitTime, 0) / 6
            )
          }
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return stadiumState;
}
