/**
 * File: edit-widget-value.js
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

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import AppDispatcher from '../../app-dispatcher';

class EditImageWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        file: ''
      },
      fileList: null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ widget: nextProps.widget });
  }

  startFileUpload() {
    // get selected file
    var formData = new FormData();

    for (var key in this.state.fileList) {
      if (this.state.fileList.hasOwnProperty(key) && this.state.fileList[key] instanceof File) {
        formData.append(key, this.state.fileList[key]);
      }
    }

    // upload files
    AppDispatcher.dispatch({
      type: 'files/start-upload',
      data: formData
    });
  }

  render() {
    return (
      <div>
        <FormGroup controlId="file">
          <ControlLabel>Image</ControlLabel>
          <FormControl componentClass="select" value={this.state.widget.file} onChange={(e) => this.props.handleChange(e)}>
            {this.props.files.map((file, index) => (
              <option key={index} value={file._id}>{file.name}</option>
            ))}
          </FormControl>
        </FormGroup>

        <FormGroup controlId="upload">
          <ControlLabel>Upload</ControlLabel>
          <FormControl type="file" onChange={(e) => this.setState({ fileList: e.target.files }) } />
        </FormGroup>

        <Button bsSize="small" onClick={() => this.startFileUpload() }>Upload</Button>
      </div>
    );
  }
}

export default EditImageWidget;
