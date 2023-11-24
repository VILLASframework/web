import { createSlice } from "@reduxjs/toolkit";
import ICDataDataManager from "../../user/users-data-manager";

const initialState = {
  currentUser: null,
  token: null,
  loginMessage: null,
  config: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    config_loaded: (state, action) => {
      state.config = action.payload;
    },
    config_load_error: (state, action) => {
      state.config = null;
    },
    users_login: (state, action) => {
      UsersDataManager.login(action.payload.username, action.payload.password);
      state.loginMessage = null;
    },
    users_extlogin: (state, action) => {
      UsersDataManager.login();
      state.loginMessage = null;
    },
    users_logout: (state, action) => {
      ICDataDataManager.closeAll();
      localStorage.clear();
      state.token = null;
      state.currentUser = null;
      state.loginMessage = null;
    },
    users_logged_in: (state, action) => {
      state.token = action.payload.token;
      state.currentUser = action.payload.currentUser;
    },
    users_login_error: (state, action) => {
      if (action.payload.error && !action.payload.error.handled) {
        state.loginMessage = "Wrong credentials! Please try again.";
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  config_loaded,
  config_load_error,
  users_logged_in,
  users_login_error,
  users_login,
  users_extlogin,
  users_logout,
} = loginSlice.actions;

export default loginSlice.reducer;
