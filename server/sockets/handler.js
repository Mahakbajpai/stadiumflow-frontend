import { getStadiumState, getAlerts, getPredictions } from '../utils/simulation.js';

// Central stadium state tracking
let stadiumState = getStadiumState();
let activeAlerts = getAlerts();
let activePrediction = getPredictions();
let activeUsers = {};

export const determineStatus = (density) => {
  if (density < 50) return 'low';
  if (density < 75) return 'medium';
  return 'high';
};

const randomFluctuation = (current, maxDiff) => {
  const diff = Math.floor(Math.random() * (maxDiff * 2 + 1)) - maxDiff;
  // Add a slight restoring force towards 50 to prevent getting stuck at edges
  const meanReversion = (50 - current) * 0.05;
  let next = current + diff + meanReversion;
  if (next < 5) next = 5;
  if (next > 100) next = 100;
  return Math.floor(next);
};

export const tickSimulation = (io) => {
  const newZones = { ...stadiumState.zones };
  let newAlerts = [...activeAlerts];

  // 1. Process zone fluctuations
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

  // Global Stat Updates
  stadiumState.global.averageWait = Math.floor(
    Object.values(newZones)
      .filter(z => z.waitTime !== undefined)
      .reduce((acc, z) => acc + z.waitTime, 0) / 6
  );

  // 2. Generate Random Alerts if dense
  const highZones = Object.values(newZones).filter(z => z.status === 'high' && Math.random() > 0.8);
  if (highZones.length > 0) {
    const zone = highZones[Math.floor(Math.random() * highZones.length)];
    const newAlert = {
      id: Date.now(),
      message: `High congestion at ${zone.name}. Expect delays.`,
      type: 'warning',
      time: new Date().toISOString()
    };
    newAlerts = [newAlert, ...newAlerts].slice(0, 5);
  }

  // 3. Simple predictive insight
  // Choose the zone with the highest growing density to be the hotspot
  const sortedByDensity = Object.values(newZones).sort((a, b) => b.density - a.density);
  if (sortedByDensity.length > 0 && Math.random() > 0.7) {
    const topZone = sortedByDensity[0];
    activePrediction = {
      nextHotspot: topZone.name,
      expectedIn: Math.floor(Math.random() * 10) + 5
    };
  }

  stadiumState.zones = newZones;
  activeAlerts = newAlerts;

  // Emit Data to Clients
  io.emit('crowdUpdate', stadiumState);
  io.emit('alertUpdate', activeAlerts);
  io.emit('predictionUpdate', activePrediction);
  io.emit('usersUpdate', activeUsers);

  return stadiumState;
};

// --- Social Map Methods ---
export const handleUserJoin = (socket, userData, io) => {
  activeUsers[socket.id] = {
    ...userData,
    id: socket.id,
    x: 50, // default spawn center
    y: 90,
  };
  io.emit('usersUpdate', activeUsers);
};

export const handleUserMove = (socket, newLocation, io) => {
  if (activeUsers[socket.id]) {
    activeUsers[socket.id].x = newLocation.x;
    activeUsers[socket.id].y = newLocation.y;
    activeUsers[socket.id].zoneId = newLocation.zoneId;
    io.emit('usersUpdate', activeUsers);
  }
};

export const handleUserDisconnect = (socketId, io) => {
  if (activeUsers[socketId]) {
    delete activeUsers[socketId];
    io.emit('usersUpdate', activeUsers);
  }
};

export const getApiCrowdState = () => stadiumState;
export const getApiAlerts = () => activeAlerts;
export const getApiPredictions = () => activePrediction;
export const getApiUsers = () => activeUsers;
