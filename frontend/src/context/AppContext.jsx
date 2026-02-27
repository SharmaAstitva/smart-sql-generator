// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [dbInfo, setDbInfo]         = useState(null);   // { database, tables_found }
  const [isConnected, setIsConnected] = useState(false);
  const [queryResult, setQueryResult] = useState(null); // Full AI response object

  const handleConnected = (info) => {
    setDbInfo(info);
    setIsConnected(true);
  };

  const handleQueryResult = (result) => {
    setQueryResult(result);
  };

  const reset = () => {
    setDbInfo(null);
    setIsConnected(false);
    setQueryResult(null);
  };

  return (
    <AppContext.Provider value={{
      dbInfo,
      isConnected,
      queryResult,
      handleConnected,
      handleQueryResult,
      reset,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
