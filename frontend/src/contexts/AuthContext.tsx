import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI

interface User {
  refreshToken: string
  accessToken?: string
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

  async function generateAccessToken(refreshToken: string) {
    try {
      const response = await axios.post(`${BACKEND_URI}/auth/generateAccessToken`, { refreshToken });
      localStorage.setItem('accessToken', response.data.token);

      setUser({ refreshToken, accessToken: response.data.token })
      return response.data.token;
    } catch (error) {
      console.error('Failed to generate access token:', error);
      // Clear invalid tokens
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      setUser(null);
      return null;
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');

        if (!refreshToken) {
          setLoading(false);
          return;
        }

        // Set user immediately if we have a refresh token
        setUser({ refreshToken });

        // Generate access token if missing
        if (!accessToken) {
          const newAccessToken = await generateAccessToken(refreshToken);
          if (!newAccessToken) {
            // If generateAccessToken failed, user is already set to null
            setLoading(false);
            return;
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URI}/auth/login`, { email, password });

      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setUser({ refreshToken: response.data.refreshToken });


        await generateAccessToken(response.data.refreshToken);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');
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