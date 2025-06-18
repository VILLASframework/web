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
  "websocket/connect",
  async ({ url, id, inputValues }, { dispatch, getState }) => {
    //check if we are already connected to this socket
    if (getState().websocket.activeSocketURLs.includes(url)) return;

    return new Promise((resolve, reject) => {
      dispatch(
        addActiveSocket({
          parameters: { id: id, url: url, inputValues: inputValues },
        })
      );
      wsManager.connect(
        id,
        url,
        (msgs, id) => {
          const icdata = {
            input: {
              version: 2,
              type: 0,
              sequence: -1,
              length: inputValues.length,
              timestamp: Date.now(),
              values: inputValues,
            },
            output: {
              values: [],
            },
          };

          const MAX_VALUES = 10000;

          if (msgs.length > 0) {
            for (let j = 0; j < msgs.length; j++) {
              let smp = msgs[j];

              for (let i = 0; i < smp.length; i++) {
                while (icdata.output.values.length < i + 1) {
                  icdata.output.values.push([]);
                }

                icdata.output.values[i].push({
                  x: smp.timestamp,
                  y: smp.values[i],
                });

                if (icdata.output.values[i].length > MAX_VALUES) {
                  const pos = icdata.output.values[i].length - MAX_VALUES;
                  icdata.output.values[i].splice(0, pos);
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
          wsManager.send(id, {
            version: 2,
            type: 0,
            sequence: 0,
            timestamp: Date.now(),
            source_index: 1,
            length: inputValues.length,
            values: inputValues,
          });
          resolve();
        },
        () => {
          console.log("WebSocket disconnected from:", url);
          dispatch(disconnect());
          reject();
        }
      );
    });
  }
);

const websocketSlice = createSlice({
  name: "websocket",
  initialState: {
    icdata: {},
    activeSocketURLs: [],
  },
  reducers: {
    addActiveSocket: (state, action) => {
      const { url, id, inputValues } = action.payload.parameters;
      const currentSockets = current(state.activeSocketURLs);
      state.activeSocketURLs = [...currentSockets, url];
      state.icdata[id] = {
        input: {
          sequence: -1,
          length: inputValues.length,
          version: 2,
          type: 0,
          timestamp: Date.now(),
          values: inputValues,
        },
        output: {},
      };
    },
    reportLength:(state,action)=>{
      return {
        ...state,
        values:new Array(action.payload).fill(0)
      }
    },
    initValue:(state,action)=>{
      let {idx,initVal} = action.payload
     state.values.splice(idx,1,initVal)
    },
    disconnect: (state, action) => {
      if (action.payload) {
        wsManager.disconnect(action.payload.id); // Ensure the WebSocket is disconnected
      }
    },
    updateIcData: (state, action) => {
      const { id, newIcData } = action.payload;
      const currentICdata = current(state.icdata);
      if (currentICdata[id].output.values) {
        const { values, ...rest } = newIcData.output;
        let oldValues = [...currentICdata[id].output.values];
        for (let i = 0; i < newIcData.output.values.length; i++) {
          oldValues[i] = [...oldValues[i], ...values[i]];
        }
        return {
          ...state,
          icdata:{
            ...state.icdata,
            [id]:{
              ...state.icdata[id],
              output:{
                ...rest,
                values:oldValues
              }
            }
          }
        }
      } else {
        console.log(newIcData)
        return {
          ...state,
          icdata:{
            ...state.icdata,
            [id]:{
              ...newIcData
            }
          }
        }
      }
    },
    //widget changes a value in input values array and they are sent to the websocket
    sendMessageToWebSocket: (state, action) => {
      const { ic, signalID, signalIndex, data } = action.payload.message;

      if (ic != null && state.icdata[ic] && state.icdata[ic].input) {
        const inputMessage = state.icdata[ic].input;

        inputMessage.timestamp = Date.now();
        inputMessage.sequence++;

        //replace only the value of the taget signal if rest of the payload is valid
        if (
          Array.isArray(inputMessage.values) &&
          signalIndex >= 0 &&
          signalIndex < inputMessage.values.length
        ) {
          inputMessage.values[signalIndex] = data;
        }

        inputMessage.length = inputMessage.values.length;
        inputMessage.source_index = signalID;

        wsManager.send(ic, JSON.parse(JSON.stringify(inputMessage)));
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectWebSocket.fulfilled, (state, action) => {});
    builder.addCase(connectWebSocket.rejected, (state, action) => {
      console.log("error", action);
    });
  },
});

export const {
  disconnect,
  updateIcData,
  addActiveSocket,
  sendMessageToWebSocket,
} = websocketSlice.actions;
export default websocketSlice.reducer;
