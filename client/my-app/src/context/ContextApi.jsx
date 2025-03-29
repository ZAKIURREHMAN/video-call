import {useMemo } from "react"
import io from 'socket.io-client'
import { CounterContext } from "./CounterContext"


export const ContextProvider = ({children})=>{
    const socket = useMemo(()=>io('http://localhost:5000') ,[])
    return(
        <CounterContext.Provider value={{socket:socket}} >
            {children}
        </CounterContext.Provider>
    )
}

