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
import classNames from "classnames";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import AppDispatcher from "../../common/app-dispatcher";

const WidgetSlider = (props) => {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    let widget = { ...props.widget };
    widget.customProperties.simStartedSendValue = false;
    AppDispatcher.dispatch({
      type: "widgets/start-edit",
      token: props.token,
      data: widget,
    });
  }, [props.token, props.widget]);

  useEffect(() => {
    // A simulation was started, make an update
    if (props.widget.customProperties.simStartedSendValue) {
      let widget = { ...props.widget };
      widget.customProperties.simStartedSendValue = false;
      AppDispatcher.dispatch({
        type: "widgets/start-edit",
        token: props.token,
        data: widget,
      });

      // Send value without changing widget
      props.onInputChanged(widget.customProperties.value, "", "", false);
    }
  }, [props.token, props.widget, props.onInputChanged]);

  useEffect(() => {
    let newValue = "";
    let newUnit = "";

    if (
      props.widget.customProperties.hasOwnProperty("value") &&
      props.widget.customProperties.value !== value
    ) {
      newValue = Number(props.widget.customProperties.value);
    } else if (value === "") {
      newValue = 0.0;
    }

    if (props.widget.signalIDs.length > 0) {
      let signalID = props.widget.signalIDs[0];
      let signal = props.signals.find((sig) => sig.id === signalID);
      if (signal !== undefined) {
        newUnit = signal.unit;
      }
    }

    if (newUnit) {
      setUnit(newUnit);
    }
    if (newValue !== "") {
      setValue(newValue);
    }
  }, [props.signals, props.widget, value]);

  const valueIsChanging = (newValue) => {
    props.widget.customProperties.value = newValue;
    if (props.widget.customProperties.continous_update) {
      valueChanged(newValue, false);
    }
    setValue(newValue);
  };

  const valueChanged = (newValue, isFinalChange) => {
    if (props.onInputChanged) {
      props.onInputChanged(newValue, "value", newValue, isFinalChange);
    }
  };

  let isVertical =
    props.widget.customProperties.orientation ===
    WidgetSlider.OrientationTypes.VERTICAL.value;

  const fields = {
    name: props.widget.name,
    control: (
      <Slider
        min={props.widget.customProperties.rangeMin}
        max={props.widget.customProperties.rangeMax}
        step={props.widget.customProperties.step}
        value={value}
        disabled={props.editing}
        vertical={isVertical}
        onChange={valueIsChanging}
        onAfterChange={(v) => valueChanged(v, true)}
      />
    ),
    value: (
      <span className="signal-value">
        {format(".2f")(Number.parseFloat(value))}
      </span>
    ),
    unit: <span className="signal-unit">{unit}</span>,
  };

  const widgetClasses = classNames({
    "slider-widget": true,
    full: true,
    vertical: isVertical,
    horizontal: !isVertical,
  });

  return (
    <>
      <div>
        {fields.name}
        {fields.value}
        {props.widget.customProperties.showUnit && fields.unit}
      </div>
      <div className={widgetClasses}>{fields.control}</div>
    </>
  );
};

WidgetSlider.OrientationTypes = {
  HORIZONTAL: { value: 0, name: "Horizontal" },
  VERTICAL: { value: 1, name: "Vertical" },
};

export default WidgetSlider;
