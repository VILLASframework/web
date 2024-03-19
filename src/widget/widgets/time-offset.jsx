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
import React, { useState, useEffect } from "react";
import TrafficLight from "react-trafficlight";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function WidgetTimeOffset(props) {
  const [state, setState] = useState({
    timeOffset: "",
    icID: "",
    icName: "",
    websocketOpen: false,
  });

  useEffect(() => {
    const { widget, ics, websockets, data } = props;

    function getDerivedStateFromProps() {
      if (
        typeof widget.customProperties.icID !== "undefined" &&
        state.icID !== widget.customProperties.icID
      ) {
        return { icID: widget.customProperties.icID };
      }

      let selectedIC, websocket;
      if (ics) {
        selectedIC = ics.find((ic) => ic.id === parseInt(state.icID, 10));
        if (selectedIC) {
          websocket = websockets.find(
            (ws) => ws.url === selectedIC.websocketurl
          );
        }
      }

      if (
        data == null ||
        data[state.icID] == null ||
        data[state.icID].output == null ||
        data[state.icID].output.timestamp == null
      ) {
        if (websocket) {
          return { timeOffset: -1, websocketOpen: websocket.connected };
        }
        return { timeOffset: -1 };
      }

      let serverTime = data[state.icID].output.timestamp;
      let localTime = Date.now();
      let absoluteOffset = Math.abs(serverTime - localTime);

      if (typeof websocket === "undefined") {
        return {
          timeOffset: Number.parseFloat(absoluteOffset / 1000).toPrecision(5),
        };
      }
      return {
        timeOffset: Number.parseFloat(absoluteOffset / 1000).toPrecision(5),
        websocketOpen: websocket.connected,
        icName: selectedIC.name,
      };
    }

    const derivedState = getDerivedStateFromProps();
    setState((prevState) => ({ ...prevState, ...derivedState }));

    // eslint-disable-next-line
  }, [props.widget, props.ics, props.websockets, props.data]);

  const { timeOffset, icID, icName, websocketOpen } = state;

  let icSelected = " ";
  if (!websocketOpen) {
    icSelected = "no connection";
  } else if (websocketOpen && timeOffset < 0) {
    icSelected = "no/invalid data";
  } else if (props.widget.customProperties.showOffset) {
    icSelected = timeOffset + "s";
  }

  return (
    <div className="time-offset">
      {props.widget.customProperties.icID !== -1 ? (
        <span></span>
      ) : (
        <span>no IC</span>
      )}
      {props.widget.customProperties.icID !== -1 &&
      props.widget.customProperties.showName ? (
        <span>{icName}</span>
      ) : (
        <span></span>
      )}
      <OverlayTrigger
        key={0}
        placement={"left"}
        overlay={
          <Tooltip id={`tooltip-${"traffic-light"}`}>
            {props.widget.customProperties.icID !== -1 ? (
              <span>
                {icName}
                <br />
                Offset: {timeOffset + "s"}
              </span>
            ) : (
              <span>Please select Infrastructure Component</span>
            )}
          </Tooltip>
        }
      >
        <TrafficLight
          Horizontal={props.widget.customProperties.horizontal}
          width={props.widget.width - 40}
          height={props.widget.height - 40}
          RedOn={
            props.widget.customProperties.threshold_red <= timeOffset ||
            !websocketOpen ||
            timeOffset < 0
          }
          YellowOn={
            props.widget.customProperties.threshold_yellow <= timeOffset &&
            timeOffset < props.widget.customProperties.threshold_red &&
            websocketOpen
          }
          GreenOn={
            timeOffset > 0 &&
            timeOffset < props.widget.customProperties.threshold_yellow &&
            websocketOpen
          }
        />
      </OverlayTrigger>
      {props.widget.customProperties.icID !== -1 ? (
        <span>{icSelected}</span>
      ) : (
        <span>selected</span>
      )}
    </div>
  );
}

export default WidgetTimeOffset;
