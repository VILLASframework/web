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

function EditWidgetCheckboxList(props) {
  // Initialize the checkedIDs state with the customProperties.checkedIDs from props
  const [checkedIDs, setCheckedIDs] = useState(
    props.widget.customProperties.checkedIDs
  );

  // Use useEffect to update the state when the widget prop changes
  useEffect(() => {
    setCheckedIDs(props.widget.customProperties.checkedIDs);
  }, [props.widget.customProperties.checkedIDs]);

  // Event handler for changes in checkboxes
  const handleCheckboxChange = (e) => {
    let currentID = parseInt(e.target.id, 10);
    let index = checkedIDs.indexOf(currentID);

    let newCheckedIDs = [...checkedIDs]; // Create a new array to avoid direct mutation
    if (index === -1) {
      newCheckedIDs.push(currentID); // Add the id if it's not already in the array
    } else {
      newCheckedIDs.splice(index, 1); // Remove the id if it's already in the array
    }

    setCheckedIDs(newCheckedIDs); // Update the state with the new array
    props.handleChange({
      target: {
        id: props.controlId,
        value: newCheckedIDs,
      },
    });
  };

  // Generate the list of checkboxes from the props list
  let checkboxList = props.list?.map((item) => (
    <Form.Check
      type={"checkbox"}
      id={item.id.toString()}
      key={item.id}
      label={item.name}
      checked={checkedIDs.includes(parseInt(item.id, 10))}
      onChange={handleCheckboxChange}
    />
  ));

  return (
    <Form.Group style={props.style}>
      <Form.Label>{props.label}</Form.Label>
      {checkboxList}
    </Form.Group>
  );
}

export default EditWidgetCheckboxList;
