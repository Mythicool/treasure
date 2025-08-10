import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  displayName?: string;
  role: string;
  business?: {
    id: string;
    name: string;
    isVerified: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('accessToken');
    if (token) {
      // In a real app, validate the token with the server
      setUser({
        id: '1',
        email: 'demo@business.com',
        displayName: 'Demo Business Owner',
        role: 'BUSINESS',
        business: {
          id: 'business1',
          name: 'Demo Coffee Shop',
          isVerified: true,
        },
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock login - in production, this would call the API
      if (email === 'demo@business.com' && password === 'demo123') {
        const mockUser: User = {
          id: '1',
          email,
          displayName: 'Demo Business Owner',
          role: 'BUSINESS',
          business: {
            id: 'business1',
            name: 'Demo Coffee Shop',
            isVerified: true,
          },
        };
        
        localStorage.setItem('accessToken', 'mock-token');
        setUser(mockUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
