"use client";
import React, { useState, createContext, useContext, useEffect } from "react";
import Loader1 from "../components/Loader1";
type AuthContextType = {
  token: string | null;
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
};
type Props = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    setToken(storedToken);
    setLoading(false);
  }, []);
  const login = (token: string) => {
    // Implement login logic here
    setToken(token);
    sessionStorage.setItem("token", token);
  };

  const logout = () => {
    // Implement logout logic here
    setToken(null);
    sessionStorage.removeItem("token");
  };

  return loading ? (
    <Loader1 />
  ) : (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
