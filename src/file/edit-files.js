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

import React from 'react';
import {Form, Button, Col, ProgressBar, Row} from 'react-bootstrap';
import Dialog from '../common/dialogs/dialog';
import AppDispatcher from "../common/app-dispatcher";
import Table from "../common/table";
import TableColumn from "../common/table-column";
import EditFileContent from  "./edit-file-content";


class EditFilesDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      uploadFile: null,
      uploadProgress: 0,
      editModal: false,
      modalFile: {}
    };
  }

  onClose() {
    this.props.onClose();
  }

  selectUploadFile(event) {
    this.setState({ uploadFile: event.target.files[0] });
  };

  startFileUpload(){
    // upload file
    const formData = new FormData();
    formData.append("file", this.state.uploadFile);

    AppDispatcher.dispatch({
      type: 'files/start-upload',
      data: formData,
      token: this.props.sessionToken,
      progressCallback: this.updateUploadProgress,
      finishedCallback: this.clearProgress,
      scenarioID: this.props.scenarioID,
    });

    this.setState({ uploadFile: null });
  };

  updateUploadProgress = (event) => {
    if (event.hasOwnProperty("percent")){
      this.setState({ uploadProgress: parseInt(event.percent.toFixed(), 10) });
    } else {
      this.setState({ uploadProgress: 0 });
    }
  };

  clearProgress = (newFileID) => {
    this.setState({ uploadProgress: 0 });
  };

  closeEditModal() {
    this.setState({editModal: false});
  }

  deleteFile(index){
    let file = this.props.files[index]
    AppDispatcher.dispatch({
      type: 'files/start-remove',
      data: file,
      token: this.props.sessionToken
    });
  }

  render() {
    let fileOptions = [];
    if (this.props.files.length > 0){
      fileOptions.push(
        <option key = {0} default>Select image file</option>
        )
      fileOptions.push(this.props.files.map((file, index) => (
        <option key={index+1} value={file.id}>{file.name}</option>
      )))
    } else {
      fileOptions = <option disabled value style={{ display: 'none' }}>No files found, please upload one first.</option>
    }

    const progressBarStyle = {
      marginLeft: '100px',
      marginTop: '-40px'
    };

    let title = this.props.locked ? "View files of scenario" : "Edit Files of Scenario";

    return (
      <Dialog
        show={this.props.show}
        title={title}
        buttonTitle="Close"
        onClose={() => this.onClose()}
        blendOutCancel = {true}
        valid={true}
      >
        <Table data={this.props.files}>
          <TableColumn
            title='ID'
            dataKey='id'
          />
          <TableColumn
            title='Name'
            dataKey='name'
          />
          <TableColumn
            title='Size (bytes)'
            dataKey='size'
          />
          <TableColumn
            title='Type'
            dataKey='type'
          />
          <TableColumn
            title=''
            align='right'
            deleteButton
            onDelete={(index) => this.deleteFile(index)}
            editButton
            onEdit={index => this.setState({ editModal: true, modalFile: this.props.files[index] })}
            locked={this.props.locked}
          />
        </Table>

        <div style={{ float: 'center' }}>
          <h5>Add file</h5>
          <Row>
            <Col xs lg="4">
              <Form.Control
                type='file'
                onChange={(event) => this.selectUploadFile(event)}
                disabled={this.props.locked}
                />
            </Col>
            <Col xs lg="2">
          <span className='solid-button'>
            <Button
              variant='secondary'
              disabled={this.state.uploadFile === null || this.props.locked}
              onClick={() => this.startFileUpload()}>
              Upload
          </Button>
          </span>
            </Col>
          </Row>
        </div>

        <br />

        <Form.Group as={Col} >
          <ProgressBar
            striped={true}
            animated={true}
            now={this.state.uploadProgress}
            label={this.state.uploadProgress + '%'}
          />
        </Form.Group>

        <div style={{ clear: 'both' }} />

        <EditFileContent
          show={this.state.editModal}
          onClose={(data) => this.closeEditModal(data)}
          sessionToken={this.props.sessionToken}
          file={this.state.modalFile}
        />
      </Dialog>
    );
  }
}

export default EditFilesDialog;
