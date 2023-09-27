export const SettingsReducer = (state, action) => {
    switch(action?.type){
        case "FETCH_USER":
            return{
                ...state,
                users:action.payload,
                loading:false
            }
        case "ADD_SINGLE_USER":
            return{
                ...state,
                users: action.payload,
                loading:false
            }
        case "ADD_USER":
            return {
                ...state,
                users:[...state.users, action.payload],
                loading:false
            }
        case "CLEAR_SETTINGS":
            return{
                ...state,
                users:[],
                loading:false
            }
        case "DROPDOWN_PREVIEW_DATA":
            return{
                ...state,
                file:action.payload,
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
        default:
            return state
    }
}