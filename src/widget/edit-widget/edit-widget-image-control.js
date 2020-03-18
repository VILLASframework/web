/**
 * File: edit-widget-image-control.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
 *
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
import {FormGroup, FormControl, FormLabel, Button, ProgressBar} from 'react-bootstrap';

import AppDispatcher from '../../common/app-dispatcher';

class EditImageWidgetControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: { },
      fileList: null,
      progress: 0
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget
    };
  }

  startFileUpload = () => {
    // get selected file
    let formData = new FormData();

    for (let key in this.state.fileList) {
      if (this.state.fileList.hasOwnProperty(key) && this.state.fileList[key] instanceof File) {
        formData.append(key, this.state.fileList[key]);
      }
    }

    // upload files
    AppDispatcher.dispatch({
      type: 'files/start-upload',
      data: formData,
      token: this.props.sessionToken,
      progressCallback: this.uploadProgress,
      finishedCallback: this.clearProgress,
      objectType: "widget",
      objectID: this.props.widget.id,
    });
  }

  uploadProgress = (e) => {
    this.setState({ progress: Math.round(e.percent) });
  }

  clearProgress = () => {
    this.setState({ progress: 0 });
  }

  handleFileChange(e){
    console.log("Changing image: ", this.props.controlId, "to", e.target.value)
    this.props.handleChange({ target: { id: this.props.controlId, value: e.target.value } });
  }

  render() {

    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if(parts.length === 1){
      isCustomProperty = false;
    }

    console.log("edit image: files: ", this.props.files, "widget", this.state.widget, "upload file list:", this.state.fileList);

    return <div>
      <FormGroup controlId="file">
        <FormLabel>Image</FormLabel>
        <FormControl
          as="select"
          placeholder="Select image file"
          value={isCustomProperty ? this.state.widget[parts[0]][parts[1]] : this.state.widget[this.props.controlId]}
          onChange={(e) => this.handleFileChange(e)}>
          {this.props.files.length === 0 ? (
            <option disabled value style={{ display: 'none' }}>No images found, please upload one first.</option>
          ) : (
            this.props.files.map((file, index) => (
              <option key={index+1} value={file.id}>{file.name}</option>
            ))
          )}
        </FormControl>
      </FormGroup>

      <FormGroup controlId="upload">
        <FormLabel>Upload</FormLabel>
        <FormControl type="file" onChange={(e) => this.setState({ fileList: e.target.files }) } />
      </FormGroup>

      <ProgressBar striped active={'true'} now={this.state.progress} label={`${this.state.progress}%`} />
      <Button size='sm' onClick={this.startFileUpload}>Upload</Button>
    </div>;
  }
}

export default EditImageWidgetControl;
