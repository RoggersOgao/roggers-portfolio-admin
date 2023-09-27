"use client"
import { createContext, useReducer } from "react";
import { ProjectReducer } from "./projectReducer";
const ProjectContext = createContext()

export const ProjectProvider = ({children}) => {
    const initialState ={
        projects:[],
        isVisible:false,
        loading:true
    }
    const [ state, dispatch] = useReducer(ProjectReducer, initialState)

    return <ProjectContext.Provider value={{
        state,
        dispatch,
        loading:state.loading
    }}>
        {children}
    </ProjectContext.Provider>
}
export default ProjectContext