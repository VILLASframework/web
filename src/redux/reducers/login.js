const initialState = {
  currentUser: null,
  token: null,
  loginMessage: null,
  config: null,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "config_loaded":
      return { ...state, config: action.payload };
    case "config_load_error":
      return { ...state, config: null };
    case "users_logged_in":
      return {
        ...state,
        token: action.payload.token,
        currentUser: action.payload.currentUser,
      };
    case "users_login_error":
      if (action.payload.error && !action.payload.error.handled) {
        return {
          ...state,
          loginMessage: "Wrong credentials! Please try again.",
        };
      }
      return state;
    default:
      return state;
  }
};

export default loginReducer;
