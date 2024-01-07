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
import React from "react";
import { Form } from "react-bootstrap";

function EditWidgetAspectControl(props) {
  // As we are not using state for any purpose other than direct reflection of props,
  // we will directly utilize props instead of maintaining a separate state.
  const widget = props.widget;

  let parts = props.controlId.split(".");
  let isCustomProperty = parts.length > 1;

  return (
    <Form.Group style={props.style}>
      <Form.Check
        type="checkbox"
        id={props.controlId}
        checked={
          isCustomProperty
            ? widget[parts[0]][parts[1]]
            : widget[props.controlId]
        }
        label={"Lock Aspect Ratio"}
        onChange={props.handleChange}
      />
    </Form.Group>
  );
}

export default EditWidgetAspectControl;
