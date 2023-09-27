"use client"
import {createContext, useReducer} from 'react'
import { SettingsReducer } from './SettingsReducer'


const SettingsContext = createContext()

export const SettingsProvider = ({children}) => {

    const initialState = {
        users: [],
        loading: true,
        file:[],
        
        isVisible:false
    }
    const [state, dispatch] = useReducer(SettingsReducer, initialState)

    return <SettingsContext.Provider value={{
        state,
        dispatch,
        loading:state.loading
    }}>
        {children}
    </SettingsContext.Provider>
}

export default SettingsContext