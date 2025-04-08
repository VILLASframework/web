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
import { Form, Button, Col, ProgressBar, Row } from "react-bootstrap";
import Dialog from "../../../common/dialogs/dialog";
import { Table, ButtonColumn, DataColumn } from "../../../common/table";
import EditFileContent from "./edit-file-content.jsx";

const EditFilesDialog = (props) => {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [modalFile, setModalFile] = useState({});

  const onClose = () => {
    props.onClose();
  };

  const selectUploadFile = (e) => {
    console.log("SELECTED FILE", e.target.files[0]);
    setUploadFile(e.target.files[0]);
  };

  let title = props.locked
    ? "View files of scenario"
    : "Edit Files of Scenario";

  return (
    <Dialog
      show={props.show}
      title={title}
      buttonTitle="Close"
      onClose={() => onClose()}
      blendOutCancel={true}
      valid={true}
    >
      <Table breakWord={true} data={props.files}>
        <DataColumn title="ID" dataKey="id" width={50} />
        <DataColumn title="Name" dataKey="name" />
        <DataColumn title="Size (bytes)" dataKey="size" />
        <DataColumn title="Type" dataKey="type" />
        <ButtonColumn
          align="right"
          deleteButton
          onDelete={props.deleteFile}
          editButton
          onEdit={(index) => {
            setEditModal(true);
            setModalFile(props.files[index]);
          }}
          locked={props.locked}
        />
      </Table>

      <div style={{ float: "center" }}>
        <h5>Add file</h5>
        <Row>
          <Col xs lg="4">
            <Form.Control
              type="file"
              onChange={(event) => selectUploadFile(event)}
              disabled={props.locked}
            />
          </Col>
          <Col xs lg="2">
            <span className="solid-button">
              <Button
                variant="secondary"
                disabled={uploadFile === null || props.locked}
                onClick={() => {
                  props.uploadFile(uploadFile);
                }}
              >
                Upload
              </Button>
            </span>
          </Col>
        </Row>
      </div>

      <br />

      <div style={{ clear: "both" }} />

      <EditFileContent
        show={editModal}
        onClose={() => setEditModal(false)}
        sessionToken={props.sessionToken}
        file={modalFile}
        updateFile={props.updateFile}
      />
    </Dialog>
  );
};

export default EditFilesDialog;
