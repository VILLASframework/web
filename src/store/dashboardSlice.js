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

import { createSlice } from "@reduxjs/toolkit";
import { sendMessageToWebSocket } from "./webSocketActions"; // Adjust the import path as needed

const initialState = {
  data: null,
  controlID: "",
  controlValue: null,
  isFinalChange: false,
  signals: [],
  icIDs: {},
};

const widgetSlice = createSlice({
  name: "widget",
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
    setControlID(state, action) {
      state.controlID = action.payload;
    },
    setControlValue(state, action) {
      state.controlValue = action.payload;
    },
    setIsFinalChange(state, action) {
      state.isFinalChange = action.payload;
    },
    setSignals(state, action) {
      state.signals = action.payload;
    },
    setIcIDs(state, action) {
      state.icIDs = action.payload;
    },
  },
});

export const {
  setWidget,
  setData,
  setControlID,
  setControlValue,
  setIsFinalChange,
  setSignals,
  setIcIDs,
} = widgetSlice.actions;

export const inputDataChanged =
  (widget, data, controlID, controlValue, isFinalChange) =>
  async (dispatch, getState) => {
    if (controlID !== "" && isFinalChange) {
      const updatedWidget = JSON.parse(JSON.stringify(widget));
      updatedWidget.customProperties[controlID] = controlValue;

      dispatch(setWidget(updatedWidget));
    }

    const state = getState().widget;
    const signalID = widget.signalIDs[0];
    const signal = state.signals.filter((s) => s.id === signalID);

    if (signal.length === 0) {
      console.warn(
        "Unable to send signal for signal ID",
        signalID,
        ". Signal not found."
      );
      return;
    }

    const icID = state.icIDs[signal[0].id];
    dispatch(
      sendMessageToWebSocket({
        message: {
          ic: icID,
          signalID: signal[0].id,
          signalIndex: signal[0].index,
          data: signal[0].scalingFactor * data,
        },
      })
    );
  };

export default widgetSlice.reducer;
