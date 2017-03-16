/**
 * File: edit-widget-value.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

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
