export const DashReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_USER":
      return {
        ...state,
        users: action.payload,
        isLoading: true,
      };
    case "FETCH_SESSION":
      return{
        session:action.payload
      }
    case "ADD_USER":
      return {
        ...state,
        users: [...state.users, action.payload],
        isLoading: true,
      };
    case "UPDATE_USER":
      const updatedUser = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );

      return {
        ...state,
        users: updatedUser,
        isLoading: true,
      };
    case "DELETE_USER":
      const filteredUsers = state.users.filter(
        (user) => user.id !== action.payload
      );
      return {
        ...state,
        users: filteredUsers,
        isLoading: true,
      };

    case "CLEAR_USER":
      return {
        ...state,
        users: [],
      };
    default:
      return state;
  }
};
