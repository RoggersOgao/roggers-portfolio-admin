export const DesignReducer = (state, action) => {
    switch(action?.type){
        case "FEETCH_DESIGN":
            return{
                ...state,
                designs:action.payload,
                loading:false
            }
        case "ADD_SINGLE_DESIGN":
            return{
                ...state,
                designs: action.payload,
                loading:false
            }
        case "ADD_DESIGN":
            return {
                ...state,
                designs:[...state.designs, action.payload],
                loading:false
            }
        case "UPDATE_DESIGN":
            const updateDesigns = state.designs.map((design)=>
            design._id === action?.payload?.id ? action?.payload : design)
            return{
                ...state,
                designs:updateDesigns,
                loading:false
            }
        case "DELETE_DESIGN":
            const filteredDesigns = state.designs.filter(
                (design) => design.id !== action.payload 
            )
            return{
                ...state,
                designs:filteredDesigns,
                loading:false
            }
        case "CLEAR_DESIGN":
            return{
                ...state,
                designs:[],
                loading:false
            }
        case "IS_VISIBLE":
            return{
                ...state,
                isVisible:true,
            }
        case "IS_NOT_VISIBLE":
            return{
                ...state,
                isVisible:false
            }
        case "SET_INDEX":
            return{
                ...state,
                designIndex: action.payload
            }
        default:
            return state
    }
}