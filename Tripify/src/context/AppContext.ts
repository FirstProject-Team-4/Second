import React, { Dispatch, SetStateAction } from "react";

type User = any; 
type UserData = any; 

type AppContextType = {
  user: User | null;
  userData: UserData | null;
  setContext: Dispatch<SetStateAction<{ user: User | null, userData: UserData | null }>>;
};

export const AppContext = React.createContext<AppContextType | undefined>(undefined);
export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};