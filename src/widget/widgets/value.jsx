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
import { format } from "d3";

function WidgetValue(props) {
  const [valueState, setValueState] = useState({
    value: NaN,
    unit: "",
    scalingFactor: 1.0,
  });

  useEffect(() => {
    function getDerivedStateFromProps() {
      if (props.widget.signalIDs.length === 0) {
        return;
      }

      // get the signal with the selected signal ID
      let signalID = props.widget.signalIDs[0];
      let signal = props.signals.filter((s) => s.id === signalID);
      if (signal.length > 0) {
        // determine ID of infrastructure component related to signal[0] (there is only one signal for a value widget)
        let icID = props.icIDs[signal[0].id];

        // check if data available
        let value = NaN;
        if (
          props.data != null &&
          props.data[icID] != null &&
          props.data[icID].output != null &&
          props.data[icID].output.values != null
        ) {
          const data = props.data[icID].output.values[signal[0].index];
          if (data != null) {
            value = signal[0].scalingFactor * data[data.length - 1].y;
          }
        }

        // Update unit and scaling factor (assuming there is exactly one signal for this widget)
        let unit = signal[0].unit;
        let scalingFactor = signal[0].scalingFactor;

        return {
          value,
          unit,
          scalingFactor,
        };
      }

      return null;
    }

    const newState = getDerivedStateFromProps();
    if (newState) {
      setValueState(newState);
    }
  }, [
    props.data,
    props.icIDs,
    props.signals,
    props.widget.signalIDs,
    props.widget.name,
  ]);

  const { value, unit, scalingFactor } = valueState;
  let value_to_render = value;
  let value_width =
    props.widget.customProperties.textSize *
    (Math.abs(value_to_render) < 1000 ? 5 : 8);
  let unit_width = props.widget.customProperties.textSize * (unit.length + 0.7);

  let showScalingFactor;
  if (props.widget.customProperties.showScalingFactor !== undefined) {
    showScalingFactor = props.widget.customProperties.showScalingFactor;
  } else {
    showScalingFactor = scalingFactor !== 1;
  }

  return (
    <div className="single-value-widget">
      <strong
        style={{
          fontSize: `${props.widget.customProperties.textSize}px`,
          flex: "1 1 auto",
        }}
      >
        {props.widget.name}
      </strong>
      <span
        style={{
          fontSize: `${props.widget.customProperties.textSize}px`,
          flex: "none",
          width: value_width,
        }}
      >
        {Number.isNaN(value_to_render)
          ? String(NaN)
          : format(".3f")(value_to_render)}
      </span>
      {props.widget.customProperties.showUnit && (
        <span
          style={{
            fontSize: `${props.widget.customProperties.textSize}px`,
            flex: "none",
            width: unit_width,
          }}
        >
          [{unit}]
        </span>
      )}
      {showScalingFactor && (
        <span
          style={{
            fontSize: `${props.widget.customProperties.textSize}px`,
            flex: "none",
            marginLeft: "0.2em",
          }}
          className="signal-scale"
        >
          {scalingFactor}
        </span>
      )}
    </div>
  );
}

export default WidgetValue;
