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
import NotificationsDataManager from '../common/data-managers/notifications-data-manager';
import NotificationsFactory from '../common/data-managers/notifications-factory';

const icSlice = createSlice({
    name: 'infrastructure',
    initialState: {
        ICsArray: [],
        checkedICsIds: [],
        isLoading: false,
        currentIC: {},
        isCurrentICLoading: false,
        //IC used for Edit and Delete Modals
        editModalIC: null,
        deleteModalIC: null,
        isDeleteModalOpened: false,
        isEditModalOpened: false
    },
    reducers: {
        updateCheckedICs: (state, args) => {
            // each table has an object that maps IDs of all its ICs to boolean values
            // which indicates wether or note user picked it in checbox column
            const checkboxValues = args.payload;
            let checkedICsIds = [...state.checkedICsIds];

            for(const id in checkboxValues){
                if(checkedICsIds.includes(id)){
                    if(!checkboxValues[id]){
                        checkedICsIds = checkedICsIds.filter((checkedId) => checkedId != id);
                    }
                } else {
                    if(checkboxValues[id]){
                        checkedICsIds.push(id);
                    }
                }
            }

            state.checkedICsIds = checkedICsIds;
        },
        clearCheckedICs: (state, args) => {
            state.checkedICsIds = [];
        },
        openEditModal: (state, args) => {
            state.isEditModalOpened = true;
            state.editModalIC = args.payload;
            console.log(state.editModalIC)
        },
        closeEditModal: (state, args) => {
            state.isEditModalOpened = false;
            state.editModalIC = null;
        },
        openDeleteModal: (state, args) => {
            state.deleteModalIC = args.payload;
            state.isDeleteModalOpened = true;
        },
        closeDeleteModal: (state, args) => {
            state.deleteModalIC = null;
            state.isDeleteModalOpened = false;
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
           .addCase(addIC.rejected, (state, action) => {
               NotificationsDataManager.addNotification(NotificationsFactory.ADD_ERROR("Error while adding infrastructural component: " + action.error.message));
           })
           .addCase(sendActionToIC.rejected, (state, action) => {
               NotificationsDataManager.addNotification(NotificationsFactory.ADD_ERROR("Error while sending action to infrastructural component: " + action.error.message));
           })
           .addCase(editIC.rejected, (state, action) => {
               NotificationsDataManager.addNotification(NotificationsFactory.ADD_ERROR("Error while trying to update an infrastructural component: " + action.error.message));
           })
           .addCase(deleteIC.rejected, (state, action) => {
               NotificationsDataManager.addNotification(NotificationsFactory.ADD_ERROR("Error while trying to delete an infrastructural component: " + action.error.message));
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

//adds a new Infrastructural component. Data object must contain token and ic fields
export const addIC = createAsyncThunk(
    'infrastructure/addIC',
    async (data, {rejectWithValue}) => {
        try {
            //post request body: ic object that is to be added
            const ic = {ic: data.ic};
            const res = await RestAPI.post('/api/v2/ic/', ic, data.token);
            return res;
        } catch (error) {
            console.log("Error adding IC: ", error);
            return rejectWithValue(error.response.data);
        }
    }
)

//sends an action to IC. Data object must contain a token, IC's id and actions string
export const sendActionToIC = createAsyncThunk(
    'infrastructure/sendActionToIC',
    async (data, {rejectWithValue}) => {
        try {
            const token = data.token;
            const id = data.id;
            let actions = data.actions;

            console.log("actions: ", actions)

            if (!Array.isArray(actions))
                actions = [ actions ]

            for (let action of actions) {
                if (action.when) {
                  // Send timestamp as Unix Timestamp
                  action.when = Math.round(new Date(action.when).getTime() / 1000);
                }
            }

            const res = await RestAPI.post('/api/v2/ic/'+id+'/action', actions, token);
            NotificationsDataManager.addNotification(NotificationsFactory.ACTION_INFO());
            return res;
         } catch (error) {
            console.log("Error sending an action to IC: ", error);
            return rejectWithValue(error.response.data);
         }
    }
)

//send a request to update IC's data. Data object must contain token, and updated ic object
export const editIC = createAsyncThunk(
    'infrastructure/editIC',
    async (data, {rejectWithValue}) => {
        try {
            //post request body: ic object that is to be added
            const {token, ic} = data;
            const res = await RestAPI.put('/api/v2/ic/'+ic.id, {ic: ic}, token);
            return res;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

//send a request to delete IC. Data object must contain token, and id of the IC that is to be deleted
export const deleteIC = createAsyncThunk(
    'infrastructure/deleteIC',
    async (data, {rejectWithValue}) => {
        try {
            //post request body: ic object that is to be added
            const {token, id} = data;
            const res = await RestAPI.delete('/api/v2/ic/'+id, token);
            return res;
        } catch (error) {
            console.log("Error updating IC: ", error);
            return rejectWithValue(error.response.data);
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

//shut ICs down
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

export const {updateCheckedICs, clearCheckedICs, openEditModal, openDeleteModal, closeDeleteModal, closeEditModal} = icSlice.actions;

export default icSlice.reducer;
