"use client"
import { createContext, useReducer } from "react";
import { DashReducer } from "./DashReducer";
const DashContext = createContext()

export const DashProvider = ({children}) => {
    const initialState ={
        users:[],
        isLoading:false,
        session:{}
    }
    const [ state, dispatch] = useReducer(DashReducer, initialState)

    return <DashContext.Provider value={{
        state,
        dispatch,
        isLoading:state.isLoading
    }}>
        {children}
    </DashContext.Provider>
}
export default DashContext