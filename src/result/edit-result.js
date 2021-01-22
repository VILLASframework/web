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
import {FormGroup, FormControl, FormLabel, Col, Button, ProgressBar} from 'react-bootstrap';
import AppDispatcher from "../common/app-dispatcher";
import FileStore from "../file/file-store"


import Table from "../common/table";
import TableColumn from "../common/table-column";

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
      fileIDs: [],
      files: null,
      resultChanged: false,
    };
  }

  onClose = canceled => {
    if (canceled) {
      if (this.props.onClose != null) {
        this.props.onClose();
      }
      return;
    }

    if (this.valid && this.props.onClose != null) {
      this.props.onClose(this.state);
    }
  };

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  resetState = () => {
    this.setState({
      id: this.props.result.id,
      description: this.props.result.description,
      result: this.props.result,
      fileIDs: this.props.result.resultFileIDs,
      files: FileStore.getState().filter(file => this.props.result.resultFileIDs.includes(file.id)),
    });
  };

  handleStartParametersChange = startParameters => {
    this.setState({ startParameters });
  };

  selectUploadFile(event) {
    this.setState({ uploadFile: event.target.files[0] });
  };

  startFileUpload(){
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

  deleteFile(index){
    let file = this.state.files[index]
    AppDispatcher.dispatch({
      type: 'files/start-remove',
      data: file,
      token: this.props.sessionToken
    });
  }

  render() {
    if (this.props.show) {
    }
    return <Dialog show={this.props.show}
                  title={'Edit Result No. '+this.state.id}
                  buttonTitle='Save'
                  onClose={this.onClose}
                  onReset={this.resetState}
                  valid={true}
                  size = 'lg'>


      <div>
        <FormGroup as={Col} controlId='description'>
          <FormLabel column={false}>Description</FormLabel>
          <FormControl type='text' placeholder='Enter description' value={this.state.description} onChange={this.handleChange} />
          <FormControl.Feedback />
        </FormGroup>

        <Table data={this.state.files}>
            <TableColumn title='ID' dataKey='id'/>
            <TableColumn title='Name' dataKey='name'/>
            <TableColumn title='Size (bytes)' dataKey='size'/>
            <TableColumn title='Type' dataKey='type'/>
            <TableColumn
              title=''
              deleteButton
              onDelete={(index) => this.deleteFile(index)}
            />
          </Table>


        <FormGroup controlId='resultfile'>
            <FormLabel>Add Result File</FormLabel>
            <FormControl type='file' onChange={(event) => this.selectUploadFile(event)} />
        </FormGroup>

          <FormGroup as={Col} >
            <Button
              disabled={this.state.uploadFile === null}
              onClick={() => this.startFileUpload()}>
              Upload
            </Button>
          </FormGroup>

          <FormGroup as={Col} >
            <ProgressBar
              striped={true}
              animated={true}
              now={this.state.uploadProgress}
              label={this.state.uploadProgress + '%'}
            />
          </FormGroup>
      
      </div>
    </Dialog>;
  }
}

export default EditResultDialog;