import { createSlice } from "@reduxjs/toolkit";
import AppDispatcher from "./app-dispatcher";
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";
import NotificationsFactory from "./data-managers/notifications-factory";

const initialState = [];
const arraySlice = createSlice({
  name: "array",
  initialState,
  reducers: {
    startLoad: (state, action) => {
      if (Array.isArray(action.payload.data)) {
        action.payload.data.forEach((id) => {
          // Load logic here using dataManager
        });
      } else {
        // Load logic here using dataManager
      }
    },
    loaded: (state, action) => {
      if (Array.isArray(action.payload.data)) {
        // Handle loaded data using updateElements
      } else {
        // Handle loaded data using updateElements
      }
    },
    loadError: (state, action) => {
      if (
        action.payload.error &&
        !action.payload.error.handled &&
        action.payload.error.response
      ) {
        // Handle load error and add notification
        NotificationsDataManager.addNotification(
          NotificationsFactory.LOAD_ERROR(
            action.payload.error.response.body.message
          )
        );
      }
    },
    startAdd: (state, action) => {
      // Add logic here using dataManager
    },
    added: (state, action) => {
      if (
        typeof action.payload.data.managedexternally !== "undefined" &&
        action.payload.data.managedexternally === true
      )
        return state;
      // Handle added data using updateElements
    },
    addError: (state, action) => {
      // Handle add error
    },
    startRemove: (state, action) => {
      // Remove logic here using dataManager
    },
    removed: (state, action) => {
      if (action.payload.original) {
        // Handle item removal using filter
      } else {
        // Handle item removal using filter
      }
    },
    removeError: (state, action) => {
      if (
        action.payload.error &&
        !action.payload.error.handled &&
        action.payload.error.response
      ) {
        // Handle remove error and add notification
        NotificationsDataManager.addNotification(
          NotificationsFactory.DELETE_ERROR(
            action.payload.error.response.body.message
          )
        );
      }
    },
    startEdit: (state, action) => {
      if (action.payload.id) {
        // Edit logic here using dataManager with an ID
      } else {
        // Edit logic here using dataManager without an ID
      }
    },
    edited: (state, action) => {
      // Handle edited data using updateElements
    },
    editError: (state, action) => {
      // Handle edit error
    },
  },
});

export const {
  startLoad,
  loaded,
  loadError,
  startAdd,
  added,
  addError,
  startRemove,
  removed,
  removeError,
  startEdit,
  edited,
  editError,
} = arraySlice.actions;

export default arraySlice.reducer;
