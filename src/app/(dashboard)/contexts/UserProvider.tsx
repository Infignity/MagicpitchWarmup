'use client'

import React, { useState, createContext, useContext, useEffect } from "react";
type Props = {
    children: React.ReactNode;
  };
  type UserContextType = {
    isMailServerModal: boolean;
    setIsMailServerModal: (value: boolean) => void;
  };

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [isMailServerModal , setIsMailServerModal] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ isMailServerModal, setIsMailServerModal }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};