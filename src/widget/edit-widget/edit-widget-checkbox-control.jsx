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
import { Form } from "react-bootstrap";

function EditWidgetCheckboxControl(props) {
  let parts = props.controlId.split(".");
  // Determine initial value whether the property is nested or direct
  let initialChecked =
    parts.length === 1
      ? props.widget[props.controlId]
      : props.widget[parts[0]][parts[1]];

  // Use useState to setup the isChecked state
  const [isChecked, setIsChecked] = useState(initialChecked);

  // useEffect to update state when props change
  useEffect(() => {
    let updatedChecked =
      parts.length === 1
        ? props.widget[props.controlId]
        : props.widget[parts[0]][parts[1]];
    setIsChecked(updatedChecked);
  }, [props.widget, props.controlId]);

  // Event handler that uses the state's current value
  const handleCheckboxChange = (e) => {
    setIsChecked(!isChecked); // We toggle the state

    // Calling parent's handleChange function with the new value
    props.handleChange({
      target: {
        id: props.controlId,
        value: !isChecked,
      },
    });
  };

  return (
    <Form.Group style={props.style}>
      <Form.Check
        type={"checkbox"}
        id={props.controlId}
        label={props.text}
        checked={isChecked}
        onChange={handleCheckboxChange}
        disabled={props.disabled !== "undefined" ? props.disabled : true}
      />
    </Form.Group>
  );
}

export default EditWidgetCheckboxControl;
