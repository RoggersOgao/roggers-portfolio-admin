"use client"
import {createContext, useReducer} from 'react'
import { DesignReducer } from './DesignReducer'


const DesignContext = createContext()

export const DesignProvider = ({children}) => {

    const initialState = {
        designs: [],
        loading: true,
        designIndex: 0,
        isVisible:false
    }
    const [state, dispatch] = useReducer(DesignReducer, initialState)

    return <DesignContext.Provider value={{
        state,
        dispatch,
        loading:state.loading
    }}>
        {children}
    </DesignContext.Provider>
}

export default DesignContext