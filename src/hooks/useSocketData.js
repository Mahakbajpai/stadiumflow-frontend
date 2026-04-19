import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:3001';

export function useSocketData() {
  const [stadiumState, setStadiumState] = useState({
    zones: {},
    global: { totalAttendees: 0, maxCapacity: 0, averageWait: 0 }
  });
  const [alerts, setAlerts] = useState([]);
  const [prediction, setPrediction] = useState({ nextHotspot: null, expectedIn: 0 });
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState({});
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    const socketUrl = window.location.hostname === "localhost" 
      ? 'http://localhost:3001' 
      : 'https://stadiumflow-backend.onrender.com';
      
    // Initialize Socket Connection
    const socket = io(socketUrl, {
      transports: ["websocket"]
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('crowdUpdate', (data) => {
      setStadiumState(data);
    });

    socket.on('alertUpdate', (data) => {
      setAlerts(data);
    });

    socket.on('predictionUpdate', (data) => {
      setPrediction(data);
    });

    socket.on('usersUpdate', (data) => {
      setActiveUsers(data);
    });

    setSocketInstance(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinStadium = (userData) => {
    if (socketInstance) {
      socketInstance.emit('userJoin', userData);
    }
  };

  const moveAvatar = (locationData) => {
    if (socketInstance) {
      socketInstance.emit('userMove', locationData);
    }
  };

  return { stadiumState, alerts, prediction, isConnected, activeUsers, joinStadium, moveAvatar };
}
