import { createSlice } from "@reduxjs/toolkit";
import ICDataDataManager from "./ic-data-data-manager";

const MAX_VALUES = 10000;

const initialState = {};

const icDataSlice = createSlice({
  name: "icData",
  initialState,
  reducers: {
    opened: (state, action) => {
      // Create an entry for the infrastructure component
      if (state[action.payload.id] === undefined) {
        state[action.payload.id] = {};
      }
    },
    prepareSignalsIn: (state, action) => {
      if (state[action.payload.id] === undefined) {
        state[action.payload.id] = {};
      }
      state[action.payload.id].input = {
        sequence: -1,
        length: action.payload.length,
        version: 2,
        type: 0,
        timestamp: Date.now(),
        values: new Array(action.payload.length).fill(0),
      };
    },
    prepareSignalsOut: (state, action) => {
      if (state[action.payload.id] === undefined) {
        state[action.payload.id] = {};
      }
      state[action.payload.id].output = {
        sequence: -1,
        length: action.payload.length,
        values: [],
      };
    },
    dataChanged: (state, action) => {
      if (state[action.payload.id] == null) {
        return;
      }

      if (state[action.payload.id].output == null) {
        state[action.payload.id].output = {
          values: [],
        };
      }

      for (let j = 0; j < action.payload.data.length; j++) {
        let smp = action.payload.data[j];

        if (smp.source_index !== 0) {
          for (let i = 0; i < smp.length; i++) {
            while (state[action.payload.id].input.values.length < i + 1) {
              state[action.payload.id].input.values.push([]);
            }

            state[action.payload.id].input.values[i] = smp.values[i];

            if (state[action.payload.id].input.values[i].length > MAX_VALUES) {
              const pos =
                state[action.payload.id].input.values[i].length - MAX_VALUES;
              state[action.payload.id].input.values[i].splice(0, pos);
            }
          }

          state[action.payload.id].input.timestamp = smp.timestamp;
          state[action.payload.id].input.sequence = smp.sequence;

          // Trigger updates of widgets that use this signal
          ICDataDataManager.updateSignalValueInWidgets(
            smp.source_index,
            smp.values
          );
        } else {
          for (let i = 0; i < smp.length; i++) {
            while (state[action.payload.id].output.values.length < i + 1) {
              state[action.payload.id].output.values.push([]);
            }

            state[action.payload.id].output.values[i].push({
              x: smp.timestamp,
              y: smp.values[i],
            });

            if (state[action.payload.id].output.values[i].length > MAX_VALUES) {
              const pos =
                state[action.payload.id].output.values[i].length - MAX_VALUES;
              state[action.payload.id].output.values[i].splice(0, pos);
            }

            state[action.payload.id].output.timestamp = smp.timestamp;
            state[action.payload.id].output.sequence = smp.sequence;
          }
        }
      }
    },
    inputChanged: (state, action) => {
      if (
        state[action.payload.ic] == null ||
        state[action.payload.ic].input == null
      ) {
        return;
      }

      state[action.payload.ic].input.timestamp = Date.now();
      state[action.payload.ic].input.sequence++;
      state[action.payload.ic].input.values[action.payload.signalIndex] =
        action.payload.data;
      state[action.payload.ic].input.length =
        state[action.payload.ic].input.values.length;
      state[action.payload.ic].input.source_index = action.payload.signalID;

      let input = JSON.parse(JSON.stringify(state[action.payload.ic].input));
      ICDataDataManager.send(input, action.payload.ic);
    },
  },
});

export const {
  opened,
  prepareSignalsIn,
  prepareSignalsOut,
  dataChanged,
  inputChanged,
} = icDataSlice.actions;

export default icDataSlice.reducer;
