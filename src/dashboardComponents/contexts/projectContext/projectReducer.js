export const ProjectReducer = (state, action) => {
  switch (action?.type) {
      case "ADD_SINGLE_PROJECT":
        return{
          ...state,
          projects:action.payload,
          loading:false
        }
    case "ADD_PROJECT":
      return {
        ...state,
        projects: [...state.projects, action.payload],
        loading: false,
      };
    case "UPDATE_PROJECT":
      const updatedproject = state.projects.map((project) =>
        project._id === action.payload.id ? action.payload : project
      );

      return {
        ...state,
        projects: updatedproject,
        loading: false,
      };
    case "DELETE_PROJECT":
      const filteredprojects = state.projects.filter(
        (project) => project.id !== action.payload
      );
      return {
        ...state,
        projects: filteredprojects,
        loading: false,
      };

    case "CLEAR_PROJECT":
      return {
        ...state,
        projects: [],
        loading:false
      };
      case "IS_VISIBLE":
        return {
          ...state,
          isVisible: true,
          loading: false
        }      
      case "IS_NOT_VISIBLE":
        return{
          ...state,
          isVisible: false
        }
    default:
      return state;
  }
};
