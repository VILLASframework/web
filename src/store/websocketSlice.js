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

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wsManager } from "../common/api/websocket-api";
import { current } from "@reduxjs/toolkit";

export const connectWebSocket = createAsyncThunk(
    'websocket/connect',
    async ({ url, id, length }, { dispatch, getState }) => {

      console.log('Want to connect to', url);

      //check if we are already connected to this socket
      if(getState().websocket.activeSocketURLs.includes(url)) return;  
      
      return new Promise((resolve, reject) => {
        dispatch(addActiveSocket({parameters: {id: id, url: url, length: length}}));
        wsManager.connect(
          id,
          url,
          (msgs, id) => {
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
    icdata: {},
    activeSocketURLs: [],
    values:[]
  },
  reducers: {
    addActiveSocket: (state, action) => {
        const {url, id, length} = action.payload.parameters;
        const currentSockets = current(state.activeSocketURLs);
        state.activeSocketURLs = [...currentSockets, url];
        state.icdata[id] = {input: {
            sequence: -1,
            length: length,
            version: 2,
            type: 0,
            timestamp: Date.now(),
            values: new Array(length).fill(0)
        }, output: {}};
    },
    reportLength:(state,action)=>{
      return {
        ...state,
        values:new Array(action.payload).fill(0)
      }
    },
    disconnect: (state, action) => {
      if(action.payload){
        wsManager.disconnect(action.payload.id); // Ensure the WebSocket is disconnected
      }
    },
    updateIcData: (state, action) => {
      const { id, newIcData } = action.payload;
      const currentICdata = current(state.icdata);
      if(currentICdata[id].output.values){
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
    sendMessageToWebSocket: (state, action) => {
        const { ic, signalID, signalIndex, data} = action.payload.message;
        const currentICdata = current(state.icdata);
        state.values[signalIndex] = data
        const values = current(state.values);
        if (!(ic == null || currentICdata[ic].input == null)) {
            const inputAction = JSON.parse(JSON.stringify(currentICdata[ic].input));
            // update message properties
            inputAction.timestamp = Date.now();
            inputAction.sequence++;
            inputAction.values = values;
            inputAction.length = inputAction.values.length;
            inputAction.source_index = signalID;
            // The previous line sets the source_index field of the message to the ID of the signal
            // so that upon loopback through VILLASrelay the value can be mapped to correct signal
    
            state.icdata[ic].input = inputAction;
            let input = JSON.parse(JSON.stringify(inputAction));
            wsManager.send(ic, input);
        }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(connectWebSocket.fulfilled, (state, action) => {
      // Handle the fulfilled state if needed
    });
    builder.addCase(connectWebSocket.rejected, (state, action) => {
      console.log('error', action);
    });
  },
});

export const { disconnect, updateIcData, addActiveSocket, sendMessageToWebSocket,reportLength } = websocketSlice.actions;
export default websocketSlice.reducer;
