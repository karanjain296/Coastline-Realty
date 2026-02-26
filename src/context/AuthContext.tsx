import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  toggleSaveProperty: (propertyId: number) => void;
  isSaved: (propertyId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('mangalore_prop_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, name: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      savedProperties: [],
    };
    setUser(newUser);
    localStorage.setItem('mangalore_prop_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mangalore_prop_user');
  };

  const toggleSaveProperty = (propertyId: number) => {
    if (!user) return;
    const isSaved = user.savedProperties.includes(propertyId);
    const newSaved = isSaved 
      ? user.savedProperties.filter(id => id !== propertyId)
      : [...user.savedProperties, propertyId];
    
    const updatedUser = { ...user, savedProperties: newSaved };
    setUser(updatedUser);
    localStorage.setItem('mangalore_prop_user', JSON.stringify(updatedUser));
  };

  const isSaved = (propertyId: number) => {
    return user?.savedProperties.includes(propertyId) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, toggleSaveProperty, isSaved }}>
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
