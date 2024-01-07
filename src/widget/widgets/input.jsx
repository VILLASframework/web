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
import { Form, Col, InputGroup } from "react-bootstrap";
import AppDispatcher from "../../common/app-dispatcher";

function WidgetInput(props) {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    const widget = { ...props.widget };
    widget.customProperties.simStartedSendValue = false;

    AppDispatcher.dispatch({
      type: "widgets/start-edit",
      token: props.token,
      data: widget,
    });
  }, [props.token, props.widget]);

  useEffect(() => {
    if (props.widget.customProperties.simStartedSendValue) {
      const widget = { ...props.widget };
      widget.customProperties.simStartedSendValue = false;

      AppDispatcher.dispatch({
        type: "widgets/start-edit",
        token: props.token,
        data: widget,
      });

      props.onInputChanged(Number(value), "", "", false);
    }
  }, [props, value]);

  useEffect(() => {
    let newValue = "";
    let newUnit = "";

    if (
      props.widget.customProperties.hasOwnProperty("value") &&
      props.widget.customProperties.value !== value
    ) {
      newValue = Number(props.widget.customProperties.value);
    } else if (
      props.widget.customProperties.hasOwnProperty("default_value") &&
      value === ""
    ) {
      newValue = Number(props.widget.customProperties.default_value);
    }

    if (props.widget.signalIDs.length > 0) {
      const signalID = props.widget.signalIDs[0];
      const signal = props.signals.find((sig) => sig.id === signalID);
      if (signal !== undefined) {
        newUnit = signal.unit;
      }
    }

    if (newUnit !== unit) {
      setUnit(newUnit);
    }

    if (newValue !== value) {
      setValue(newValue);
    }
  }, [props, value, unit]);

  const valueIsChanging = (newValue) => {
    const numericalValue = Number(newValue);
    setValue(numericalValue);
    props.widget.customProperties.value = numericalValue;
  };

  const valueChanged = (newValue) => {
    if (props.onInputChanged) {
      props.onInputChanged(Number(newValue), "value", Number(newValue), true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      valueChanged(value);
    }
  };

  return (
    <div className="number-input-widget full">
      <Form>
        <Form.Group>
          <Col as={Form.Label}>
            {props.widget.name}
            {props.widget.customProperties.showUnit ? ` [${unit}]` : ""}
          </Col>
          <Col>
            <InputGroup>
              <Form.Control
                type="number"
                step="any"
                disabled={props.editing}
                onKeyPress={handleKeyPress}
                onBlur={() => valueChanged(value)}
                onChange={(e) => valueIsChanging(e.target.value)}
                placeholder="Enter value"
                value={value}
              />
            </InputGroup>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}

export default WidgetInput;
