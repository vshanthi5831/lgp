import { createContext, useContext, useState } from 'react';

// Create context
export const AuthContext = createContext();

// Hook for easy use
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null or { role: 'student' | 'admin' }

  const login = (userData) => setUser(userData); // call this after login
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
