import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthUser, UserRole } from '../models/ui_types/user';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  setAuthUser: (user: AuthUser | null) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('tech_sales_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('tech_sales_user');
      }
    }
    setIsLoading(false);
  }, []);

  const setAuthUser = (newUser: AuthUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('tech_sales_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('tech_sales_user');
    }
  };

  const logout = () => {
    setAuthUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setAuthUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setAuthUser, logout, switchRole }}>
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
