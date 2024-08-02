
const initialState = {
  user:{ },
  post:{ }
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
    case "LOGIN_ERROR":
      return initialState;
    default:
      return state;
  }
};