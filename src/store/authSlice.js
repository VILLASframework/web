/**
 * This file is part of VILLASweb.
 *
 * VILLASweb is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * VILLASweb is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with VILLASweb. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { sessionToken, currentUser } from '../localStorage';

const initialState = {
  user: currentUser,
  token: sessionToken,
  isAuthenticated: sessionToken && currentUser,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    deleteUser: (state) => {
      state.user = null;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.clear();
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.authenticateUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      apiSlice.endpoints.authenticateUser.matchRejected,
      (state, { error }) => {
        state.error = error;
      }
    );
  },
});

export const selectToken = (state) => state.auth.token; 

export const { setUser, deleteUser } = authSlice.actions;

export default authSlice.reducer;