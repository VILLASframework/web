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

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import RestAPI from '../common/api/rest-api';
import ICDataDataManager from '../ic/ic-data-data-manager';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null, 
        currentToken: null,
        isLoading: false, 
        loginMessage: ''},
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false
            state.currentUser = action.payload.user
            state.currentToken = action.payload.token

            localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        })
        .addCase(login.rejected, (state, action) => {
            state.loginMessage = 'Wrong credentials! Please try again.'
        })
        .addCase(logout.pending, (state) => {
            state.currentUser = null
            state.currentToken = null
        })
        .addCase(loginExternal.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(loginExternal.fulfilled, (state, action) => {
            state.isLoading = false
            state.currentUser = action.payload.user
            state.currentToken = action.payload.token

            localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        })
    }
})

export const login = createAsyncThunk(
    'user/login',
    async (userData, thunkAPI) => {
        try {
            const res = await RestAPI.post('/api/v2/authenticate/internal', userData)
            
            return {user: res.user, token: res.token}
        } catch(error) {
            console.log('Error while trying to log in: ', error)
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const loginExternal = createAsyncThunk(
    'user/loginExternal',
    async (data, thunkAPI) => {
        try {
            const res = await RestAPI.post(this.makeURL('/authenticate/external'), null, null, 60000) 
            
            return {user: res.user, token: res.token}
        } catch(error) {
            console.log('Error while trying to log in externally: ', error)
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const logout = createAsyncThunk(
    'user/logout',
    async () => {
        // disconnect from all infrastructure components
        ICDataDataManager.closeAll();
        //remove token and current user from local storage
        localStorage.clear();

        console.log("logged out")
    }
)

export default userSlice.reducer