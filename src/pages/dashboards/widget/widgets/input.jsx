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
import { useUpdateWidgetMutation } from "../../../../store/apiSlice";

const WidgetInput = ({ signals, widget, editing, onInputChanged }) => {
  const initialValue =
    widget.customProperties.value !== undefined
      ? Number(widget.customProperties.value)
      : widget.customProperties.default_value !== undefined
      ? Number(widget.customProperties.default_value)
      : "";
  const [value, setValue] = useState(initialValue);
  const [unit, setUnit] = useState("");

  const [updateWidget] = useUpdateWidgetMutation();

  useEffect(() => {
    if (widget.customProperties.simStartedSendValue) {
      widget.customProperties.simStartedSendValue = false;
      if(onInputChanged && signals && signals.length > 0){
        onInputChanged(widget.customProperties.value, "", "", false);
      }
      updateWidgetSimStatus(false);

      onInputChanged(Number(value), "", false, false);
    }
  }, [value]);

  //once widget is mounted, update status
  useEffect(() => {
    updateWidgetSimStatus(true);
  }, [widget.id]);

  useEffect(() => {
    if (widget.customProperties.simStartedSendValue) {
      updateWidgetSimStatus(false);
      if (onInputChanged) {
        onInputChanged(Number(value), "", false, false);
      }
    }
  }, [value]);

  useEffect(() => {
    let newValue = widget.customProperties.value;
    if (
      newValue === undefined &&
      widget.customProperties.default_value !== undefined
    ) {
      newValue = widget.customProperties.default_value;
    }
    if (newValue !== undefined && Number(newValue) !== Number(value)) {
      setValue(Number(newValue));
    }

    if (widget.signalIDs && widget.signalIDs.length > 0) {
      const signalID = widget.signalIDs[0];
      const signal = signals.find((sig) => sig.id === signalID);
      if (signal && signal.unit !== unit) {
        setUnit(signal.unit);
      }
    }
  }, [widget, signals]);

  const updateWidgetSimStatus = async (isSimStarted) => {
    try {
      await updateWidget({
        widgetID: widget.id,
        updatedWidget: {
          widget: {
            ...widget,
            customProperties: {
              ...widget.customProperties,
              simStartedSendValue: isSimStarted,
            },
          },
        },
      }).unwrap();
    } catch (err) {
      console.log("Error updating simulation status:", err);
    }
  };

  const valueIsChanging = (newValue) => {
    const numericalValue = Number(newValue);
    setValue(numericalValue);
    widget.customProperties.value = numericalValue;
  };

  const valueChanged = (newValue) => {
    if (onInputChanged) {
      onInputChanged(Number(newValue), "value", Number(newValue), true);
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
            {widget.name}
            {widget.customProperties.showUnit ? ` [${unit}]` : ""}
          </Col>
          <Col>
            <InputGroup>
              <Form.Control
                type="number"
                step="any"
                disabled={editing}
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
};

export default WidgetInput;
