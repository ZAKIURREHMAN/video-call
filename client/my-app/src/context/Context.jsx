import { createContext, useContext } from "react";

export const CounterContext = createContext();

export const counterContextFun = () => {
  const socket = useContext(CounterContext);
  return socket;
};

export const ContextProvider = ({ children }) => {
  return <CounterContext.Provider value={{name:'zakiiii'}} >{children}</CounterContext.Provider>;
};
