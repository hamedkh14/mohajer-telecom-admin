import React, { createContext, useContext } from 'react';

export type AuthContextType = {
  authUser: {
    isAuthenticated: boolean,
    user: any
  };
  handleAuthUser: (val: any) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
