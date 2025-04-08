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
import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import Dialog from "../../../common/dialogs/dialog";

const EditFileContent = ({ show, onClose, file, updateFile }) => {
  const [uploadFile, setUploadFile] = useState(null);

  const selectUploadFile = (event) => {
    const selectedFile = event.target.files[0];
    setUploadFile(selectedFile);
  };

  const handleUploadFile = () => {
    updateFile(file.id, uploadFile);
    setUploadFile(null);
    onClose();
  };

  return (
    <Dialog
      show={show}
      title="Edit File Content"
      buttonTitle="Close"
      onClose={onClose}
      blendOutCancel={true}
      valid={true}
    >
      <Form.Group as={Col}>
        <Form.Control type="file" onChange={selectUploadFile} />
      </Form.Group>

      <Form.Group as={Col}>
        <Button disabled={!uploadFile} onClick={handleUploadFile}>
          Upload
        </Button>
      </Form.Group>
    </Dialog>
  );
};

export default EditFileContent;
