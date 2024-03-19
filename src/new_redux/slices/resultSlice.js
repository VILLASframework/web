import { createSlice } from '@reduxjs/toolkit';
import { arraySlice } from './arrayReducer';
// Import any other necessary utilities

export const resultSlice = createSlice({
  name: 'results',
  initialState: arraySlice.getInitialState(),
  reducers: {
    loaded: (state, action) => {
      // Use your simplifyTimestamps function here before deferring to the arraySlice reducer
      arraySlice.caseReducers.loaded(state, action);
    },
    added: (state, action) => {
      // Similar changes go here
      arraySlice.caseReducers.added(state, action);
    },
    edited: (state, action) => {
      // Repeat the process for the 'edited' logic
      arraySlice.caseReducers.edited(state, action);
    },
    removed: (state, action) => {
      // Implement additional logic if needed and then do the same
      arraySlice.caseReducers.removed(state, action);
    },
    // Add additional case reducers here
  },
});

// Export actions
export const { loaded, added, edited, removed } = resultSlice.actions;

// Export the reducer
export default resultSlice.reducer;