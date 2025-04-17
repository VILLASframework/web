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

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { connectWebSocket } from "../../../store/websocketSlice";

//this hook is used to establish websocket connection in the dashboard
const useWebSocketConnection = (activeICS, signals, widgets) => {
  const dispatch = useDispatch();
  const hasConnectedRef = useRef(false);
  const startUpdaterWidgets = new Set(["Slider", "Button", "NumberInput"]);

  useEffect(() => {
    //we want to connect only once after widgets, signals and activeICs are loaded
    if (
      !hasConnectedRef.current &&
      signals.length > 0 &&
      activeICS.length > 0 &&
      widgets.length > 0
    ) {
      activeICS.forEach((i) => {
        if (i.websocketurl) {
          console.log("CONNECTING TO A WEBSOCKET FROM", i);
          let inputValues = [];
          //read values of all the manipulation widgets and set their values to the corresponding input signals
          const inputSignals = [...signals].filter((s) => s.direction == "in");
          if (inputSignals.length > 0) {
            //initialize values for input signals
            inputValues = new Array(inputSignals.length).fill(0);
            //go through all the widgets and check if they have a value for any of the input signals
            //add this value to the inputValues array at the index
            widgets.forEach((widget) => {
              if (startUpdaterWidgets.has(widget.type)) {
                const matchingSignal = inputSignals.find((signal) =>
                  widget.signalIDs.includes(signal.id)
                );
                if (
                  matchingSignal &&
                  !isNaN(matchingSignal.index) &&
                  matchingSignal.index < inputValues.length
                ) {
                  if (widget.type == "Button") {
                    inputValues[matchingSignal.index] = widget.customProperties
                      .pressed
                      ? widget.customProperties.on_value
                      : widget.customProperties.off_value;
                  } else {
                    inputValues[matchingSignal.index] =
                      widget.customProperties.value;
                  }
                }
              }
            });
          }

          dispatch(
            connectWebSocket({
              url: i.websocketurl,
              id: i.id,
              inputValues: inputValues,
            })
          );
        }
      });

      hasConnectedRef.current = true;
    }
  }, [activeICS, signals, widgets]);
};

export default useWebSocketConnection;
