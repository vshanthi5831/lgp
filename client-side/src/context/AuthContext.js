import { createContext, useContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user: { role, id, token, ... }

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/login', {
        email,
        password
      });

      if (res.data.status === 'success') {
        const token = res.data.token;

        const userData =
          res.data.student
            ? { ...res.data.student, role: 'student', token }
            : { ...res.data.admin, role: 'admin', token };

        setUser(userData);
        localStorage.setItem('authToken', token);

        return { success: true, role: userData.role };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
