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

const EditFileWidgetControl = (props) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles(props.files.filter((file) => file.type.includes(props.type)));
  }, [props.files, props.type]);

  const handleFileChange = (e) => {
    props.handleChange({
      target: { id: props.controlId, value: e.target.value },
    });
  };

  const parts = props.controlId.split(".");
  const isCustomProperty = parts.length !== 1;

  let fileOptions;
  if (files.length > 0) {
    fileOptions = [
      <option key={0} defaultValue>
        Select file
      </option>,
      ...files.map((file, index) => (
        <option key={index + 1} value={file.id}>
          {file.name}
        </option>
      )),
    ];
  } else {
    fileOptions = <option style={{ display: "none" }}>No files found</option>;
  }

  return (
    <div style={props.style}>
      <Form.Group controlId="file">
        <Form.Label>File</Form.Label>
        <Form.Control
          as="select"
          value={
            isCustomProperty
              ? props.widget[parts[0]][parts[1]]
              : props.widget[props.controlId]
          }
          onChange={handleFileChange}
        >
          {fileOptions}
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default EditFileWidgetControl;
