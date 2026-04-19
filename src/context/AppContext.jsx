import React, { createContext, useState, useEffect, useContext } from 'react';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('stadiumUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [searchFriendQuery, setSearchFriendQuery] = useState("");

  // Persist user on changes seamlessly
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stadiumUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const login = (userData) => {
    setCurrentUser(userData);
    setIsEditingProfile(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('stadiumUser');
    setIsEditingProfile(false);
  };

  const placeOrder = (items, total) => {
    const newOrder = {
       id: Math.random().toString(36).substr(2, 9),
       items,
       total,
       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
       status: 'Preparing'
    };
    setActiveOrders(prev => [newOrder, ...prev]);
  };

  const cancelOrder = (orderId) => {
    setActiveOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      isEditingProfile,
      setIsEditingProfile,
      activeOrders,
      placeOrder,
      cancelOrder,
      searchFriendQuery,
      setSearchFriendQuery
    }}>
      {children}
    </AppContext.Provider>
  );
};
