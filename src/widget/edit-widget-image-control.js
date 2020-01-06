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
import { FormGroup, FormControl, FormLabel, Button, ProgressBar } from 'react-bootstrap';

import AppDispatcher from '../common/app-dispatcher';

class EditImageWidgetControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        customProperties:{
        file: ''
        }
      },
      fileList: null,
      progress: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ widget: nextProps.widget });
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
      finishedCallback: this.clearProgress
    });
  }

  uploadProgress = (e) => {
    this.setState({ progress: Math.round(e.percent) });
  }

  clearProgress = () => {
    this.setState({ progress: 0 });
  }

  render() {
    return <div>
      <FormGroup controlId="file">
        <FormLabel>Image</FormLabel>
        <FormControl componentClass="select" value={this.state.widget.customProperties.file} onChange={(e) => this.props.handleChange(e)}>
          {this.props.files.length === 0 ? (
            <option disabled value style={{ display: 'none' }}>No images found, please upload one first.</option>
          ) : (
            this.props.files.reduce((entries, file, index) => {
              entries.push(<option key={++index} value={file._id}>{file.name}</option>);
              return entries;
            }, [
              <option key={0} value=''>Please select one image</option>
            ])
          )}
        </FormControl>
      </FormGroup>

      <FormGroup controlId="upload">
        <FormLabel>Upload</FormLabel>
        <FormControl type="file" onChange={(e) => this.setState({ fileList: e.target.files }) } />
      </FormGroup>

      <ProgressBar striped active now={this.state.progress} label={`${this.state.progress}%`} />
      <Button bsSize="small" onClick={this.startFileUpload}>Upload</Button>
    </div>;
  }
}

export default EditImageWidgetControl;
