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
import { Form, Col, Row, Button, ProgressBar } from 'react-bootstrap';
import AppDispatcher from "../common/app-dispatcher";
import FileStore from "../file/file-store"

import { Table, ButtonColumn, DataColumn } from "../common/table";
import Dialog from '../common/dialogs/dialog';

class EditResultDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      description: '',
      uploadFile: null,
      uploadProgress: 0,
      files: null,
    };
  }

  onClose() {
    if (this.props.onClose != null) {
      this.props.onClose();
    }
  };

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  isEmpty(val) {
    return (val === undefined || val == null || val.length <= 0);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.resultId != prevProps.resultId || this.props.results != prevProps.results) {
      let result = this.props.results[this.props.resultId];

      if (result && Object.keys(result).length != 0) {
        let hasFiles = !this.isEmpty(result.resultFileIDs);
        if (hasFiles) {
          this.setState({
            id: result.id,
            description: result.description,
            files: FileStore.getState().filter(file => result.resultFileIDs.includes(file.id)),
          })
        } else {
          this.setState({
            id: result.id,
            description: result.description,
            files: null,
          })
        }
      }
    }
  };

  selectUploadFile(event) {
    this.setState({ uploadFile: event.target.files[0] });
  };

  startFileUpload() {
    const formData = new FormData();
    formData.append("file", this.state.uploadFile);

    AppDispatcher.dispatch({
      type: 'resultfiles/start-upload',
      data: formData,
      resultID: this.state.id,
      token: this.props.sessionToken,
      progressCallback: this.updateUploadProgress,
      finishedCallback: this.clearProgress,
      scenarioID: this.props.scenarioID,
    });

    this.setState({ uploadFile: null });
  };

  clearProgress = (newFileID) => {
    this.setState({ uploadProgress: 0 });
  };

  updateUploadProgress = (event) => {
    this.setState({ uploadProgress: parseInt(event.percent.toFixed(), 10) });
  };

  deleteFile(index) {
    let file = this.state.files[index];
    AppDispatcher.dispatch({
      type: 'resultfiles/start-remove',
      resultID: this.state.id,
      fileID: file.id,
      token: this.props.sessionToken
    });

  }

  submitDescription() {
    let result = this.props.results[this.props.resultId];
    if (!this.isEmpty(result)) {
      result.description = this.state.description;
      AppDispatcher.dispatch({
        type: 'results/start-edit',
        data: result,
        token: this.props.sessionToken
      });
    }
  }

  render() {
    return <Dialog
      show={this.props.show}
      title={'Edit Result No. ' + this.state.id}
      buttonTitle='Close'
      onClose={() => this.onClose()}
      blendOutCancel={true}
      valid={true}
    >
      <Form.Group as={Col} controlId='description' style={{marginBottom: '15px'}}>
        <Row style={{ float: 'center' }} >
          <Col xs lg="2">
            <Form.Label>Description</Form.Label>
          </Col>
          <Col xs lg="4">
            <Form.Control
              type='text'
              placeholder={this.state.description}
              value={this.state.description}
              onChange={this.handleChange}
            />
            <Form.Control.Feedback />
          </Col>
          <Col xs lg="2">
          <span className='solid-button'>
            <Button
              type="submit"
              onClick={() => this.submitDescription()}>
              Save
          </Button>
          </span>
          </Col>
        </Row>
      </Form.Group>

      <Table breakWord={true} data={this.state.files}>
        <DataColumn
          title='ID'
          dataKey='id'
        />
        <DataColumn
          title='Name'
          dataKey='name'
        />
        <DataColumn
          title='Size (bytes)'
          dataKey='size'
        />
        <DataColumn
          title='Type'
          dataKey='type'
        />
        <ButtonColumn
          title=''
          deleteButton
          onDelete={(index) => this.deleteFile(index)}
        />
      </Table>

      <div style={{ float: 'center' }}>
        <h5>Add result file</h5>
        <Row>
          <Col xs lg="4">
            <Form.Control type='file' onChange={(event) => this.selectUploadFile(event)} />
          </Col>
          <Col xs lg="2">
          <span className='solid-button'>
            <Button
              variant='secondary'
              disabled={this.state.uploadFile === null}
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
    </Dialog>;
  }
}

export default EditResultDialog;
