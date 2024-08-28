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

const configSlice = createSlice({
    name: 'config',
    initialState: {
        config: {},
        isLoading: false
    },
    extraReducers: builder => {
        builder
           .addCase(loadConfig.pending, (state, action) => {
                state.isLoading = true
           })
           .addCase(loadConfig.fulfilled, (state, action) => {
                state.isLoading = false
                state.config = action.payload;
                console.log("fetched config", action.payload)
           })
    }
});

//loads all ICs and saves them in the store
export const loadConfig = createAsyncThunk(
    'config/loadConfig',
    async (data) => {
        try {
            const res = await RestAPI.get("/api/v2/config", null);
            console.log("response:", res)
            return res;
        } catch (error) {
            console.log("Error loading config", error);
        }
    }
);

export default configSlice.reducer;
