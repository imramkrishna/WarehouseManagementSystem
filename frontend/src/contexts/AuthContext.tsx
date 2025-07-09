import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI
console.log(BACKEND_URI)
interface User {
  refreshToken: string
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      // Simulate API call to validate token
      setTimeout(() => {
        setUser({
          refreshToken: token
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const response = await axios.post(`${BACKEND_URI}/auth/login`, { email, password })


    if (response) {
      localStorage.setItem('refreshToken', response.data.token);
    } else {
      throw new Error('Invalid credentials');
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('refreshToken');
    localStorage.removeItem("accessToken")
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}