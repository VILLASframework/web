import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wsManager } from "../common/api/websocket-api";
import { current } from "@reduxjs/toolkit";

export const connectWebSocket = createAsyncThunk(
    'websocket/connect',
    async ({ url, id, length }, { dispatch }) => {
      return new Promise((resolve, reject) => {
        wsManager.connect(
          url,
          (msgs) => {
            const icdata = {
              input: {
                sequence: -1,
                length: length,
                version: 2,
                type: 0,
                timestamp: Date.now(),
                values: new Array(length).fill(0),
              },
              output: {
                values: [],
              },
            };
  
            const MAX_VALUES = 10000;
  
            if (msgs.length > 0) {
              for (let j = 0; j < msgs.length; j++) {
                let smp = msgs[j];
  
                if (smp.source_index !== 0) {
                  for (let i = 0; i < smp.length; i++) {
                    while (icdata.input.values.length < i + 1) {
                      icdata.input.values.push([]);
                    }
  
                    icdata.input.values[i] = smp.values[i];
  
                    if (icdata.input.values[i].length > MAX_VALUES) {
                      const pos = icdata.input.values[i].length - MAX_VALUES;
                      icdata.input.values[i].splice(0, pos);
                    }
                  }
  
                  icdata.input.timestamp = smp.timestamp;
                  icdata.input.sequence = smp.sequence;
                } else {
                  for (let i = 0; i < smp.length; i++) {
                    while (icdata.output.values.length < i + 1) {
                      icdata.output.values.push([]);
                    }
  
                    icdata.output.values[i].push({ x: smp.timestamp, y: smp.values[i] });
  
                    if (icdata.output.values[i].length > MAX_VALUES) {
                      const pos = icdata.output.values[i].length - MAX_VALUES;
                      icdata.output.values[i].splice(0, pos);
                    }
                  }
  
                  icdata.output.timestamp = smp.timestamp;
                  icdata.output.sequence = smp.sequence;
                }
              }
  
              // Dispatch the action to update the Redux state
              dispatch(updateIcData({ id, newIcData: icdata }));
            }
          },
          () => {
            console.log('WebSocket connected to:', url);
            dispatch(setConnectedUrl({ url })); // Optional: Track the connected URL
            resolve(); // Resolve the promise on successful connection
          },
          () => {
            console.log('WebSocket disconnected from:', url);
            dispatch(disconnect());
            reject(); // Reject the promise if the connection is closed
          }
        );
      });
    }
);

const websocketSlice = createSlice({
  name: 'websocket',
  initialState: {
    connectedUrl: null,
    icdata: {},
  },
  reducers: {
    setConnectedUrl: (state, action) => {
      state.connectedUrl = action.payload.url;
    },
    disconnect: (state) => {
      wsManager.disconnect(); // Ensure the WebSocket is disconnected
      state.connectedUrl = null;
    },
    updateIcData: (state, action) => {
      const { id, newIcData } = action.payload;
      const currentICdata = current(state.icdata);
      if(currentICdata[id]){
        const {values, ...rest} = newIcData.output;
        let oldValues = [...currentICdata[id].output.values];
        for(let i = 0; i < newIcData.output.values.length; i++){
            oldValues[i] = [...oldValues[i], ...values[i]]
        }
        state.icdata[id] = {
            input: newIcData.input,
            output: {
                ...rest,
                values: oldValues
            }
        }
      } else {
        state.icdata[id] = {
          ...newIcData,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectWebSocket.fulfilled, (state, action) => {
      // Handle the fulfilled state if needed
    });
    builder.addCase(connectWebSocket.rejected, (state, action) => {
      // Handle the rejected state if needed
    });
  },
});

export const { setConnectedUrl, disconnect, updateIcData } = websocketSlice.actions;
export default websocketSlice.reducer;
