// userReducer.js
const initialState = {
    user: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...state,
          user: action.payload,
        };
      case 'LOGOUT':
        return {
          ...state,
          user: null,
        };
        case 'UPDATE_USER': 
      return {
        ...state,
        user: action.payload,
      };
      default:
        return state;
    }
  };
  
  export default userReducer;
  