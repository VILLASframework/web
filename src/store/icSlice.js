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

import { sessionToken } from '../localStorage';

const icSlice = createSlice({
    name: 'infrastructure',
    initialState: {
        ICsArray: [],
        checkedICsArray: [],
        isLoading: false,
        currentIC: {},
        isCurrentICLoading: false
    },
    reducers: {
        checkICsByCategory: (state, args) => {
            const category = args.payload;

            for(const ic in state.ICsArray){
                if (ic.category == category) state.checkedICsArray.push(ic)
            }
        }
    },
    extraReducers: builder => {
        builder
           .addCase(loadAllICs.pending, (state, action) => {
                state.isLoading = true
           })
           .addCase(loadAllICs.fulfilled, (state, action) => {
                state.ICsArray = action.payload;
                console.log("fetched ICs")
           })
           .addCase(loadICbyId.pending, (state, action) => {
                state.isCurrentICLoading = true
            })
            .addCase(loadICbyId.fulfilled, (state, action) => {
                    state.isCurrentICLoading = false
                    state.currentIC = action.payload;
                    console.log("fetched IC", state.currentIC.name)
            })
            //TODO
            // .addCase(restartIC.fullfilled, (state, action) => {
            //     console.log("restart fullfilled")
            //     //loadAllICs({token: sessionToken})
            // })
            // .addCase(shutdownIC.fullfilled, (state, action) => {
            //     console.log("shutdown fullfilled")
            //     //loadAllICs({token: sessionToken})
            // })
    }
});

//loads all ICs and saves them in the store
export const loadAllICs = createAsyncThunk(
    'infrastructure/loadAllICs',
    async (data) => {
        try {
            const res = await RestAPI.get('/api/v2/ic', data.token);
            return res.ics;
        } catch (error) {
            console.log("Error loading ICs data: ", error);
        }
    }
);

//loads one IC by its id
export const loadICbyId = createAsyncThunk(
    'infrastructure/loadICbyId',
    async (data) => {
        try {
            const res = await RestAPI.get('/api/v2/ic/' + data.id, data.token);
            return res.ic;
        } catch (error) {
            console.log("Error loading IC (id=" + data.id + ") : ", error);
        }
    }
)

//TODO

//restarts ICs
export const restartIC = createAsyncThunk(
    'infrastructure/restartIC',
    async (data) => {
        try {
            const url = data.apiurl + '/restart'
            const res = await RestAPI.post(data.apiurl, null);
            console.log(res)
            return res;
        } catch (error) {
            console.log("Error restarting IC: ", error);
        }
    }
)

//restarts ICs
export const shutdownIC = createAsyncThunk(
    'infrastructure/shutdownIC',
    async (data) => {
        try {
            const url = data.apiurl + '/shutdown'
            const res = await RestAPI.post(data.apiurl, null);
            console.log(res)
            return res;
        } catch (error) {
            console.log("Error shutting IC down: ", error);
        }
    }
)

export const {checkICsByCategory} = icSlice.actions;

export default icSlice.reducer;