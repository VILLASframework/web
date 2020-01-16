/**
 * File: selectFile.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 10.05.2018
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
import { Container } from 'flux/utils';
import { FormGroup, FormControl, FormLabel, Button, ProgressBar, Col } from 'react-bootstrap';

import FileStore from './file-store';
import LoginStore from '../user/login-store';

import AppDispatcher from '../common/app-dispatcher';

class SelectFile extends React.Component {
  static getStores() {
      return [ FileStore, LoginStore ];
  }

  static calculateState() {
      return {
          files: FileStore.getState(),
          sessionToken: LoginStore.getState().token,
          selectedFile: '',
          uploadFile: null,
          uploadProgress: 0
      };
  }

  componentDidMount() {
      AppDispatcher.dispatch({
          type: 'files/start-load',
          token: this.state.sessionToken
      });
  }

  static getDerivedStateFromProps(props, state){
    if (props.value === state.selectedSimulator) {
      return null;
    }

    let selectedSimulator = props.value;
    if (selectedSimulator == null) {
      if (state.simulators.length > 0) {
        selectedSimulator = state.simulators[0]._id;
      } else {
        selectedSimulator = '';
      }
    }

    return {selectedSimulator};
  }

  handleChange = event => {
      this.setState({ selectedFile: event.target.value });

      // send file to callback
      if (this.props.onChange != null) {
          const file = this.state.files.find(f => f._id === event.target.value);

          this.props.onChange(file);
      }
  };

  selectUploadFile = event => {
      this.setState({ uploadFile: event.target.files[0] });
  };

  startFileUpload = () => {
      // upload file
      const formData = new FormData();
      formData.append(0, this.state.uploadFile);

      AppDispatcher.dispatch({
          type: 'files/start-upload',
          data: formData,
          token: this.state.sessionToken,
          progressCallback: this.updateUploadProgress,
          finishedCallback: this.clearProgress
      });
  };

  updateUploadProgress = event => {
      this.setState({ uploadProgress: parseInt(event.percent.toFixed(), 10) });
  };

  clearProgress = () => {
      // select uploaded file
      const selectedFile = this.state.files[this.state.files.length - 1]._id;
      this.setState({ selectedFile, uploadProgress: 0 });
  };

  render() {
      const fileOptions = this.state.files.map(f =>
          <option key={f._id} value={f._id}>{f.name}</option>
      );

      const progressBarStyle = {
          marginLeft: '100px',
          marginTop: '-25px'
      };

      return <div>
          <FormGroup>
              <Col componentClass={FormLabel} sm={3} md={2}>
                  {this.props.name}
              </Col>

              <Col sm={9} md={10}>
                  <FormControl disabled={this.props.disabled} componentClass='select' placeholder='Select file' onChange={this.handleChange}>
                      {fileOptions}
                  </FormControl>
              </Col>
          </FormGroup>

          <FormGroup>
              <Col sm={9} md={10} smOffset={3} mdOffset={2}>
                  <FormControl disabled={this.props.disabled} type='file' onChange={this.selectUploadFile} />
              </Col>
          </FormGroup>

          <FormGroup>
              <Col sm={9} md={10} smOffset={3} mdOffset={2}>
                  <Button disabled={this.props.disabled} bsSize='small' onClick={this.startFileUpload}>
                      Upload file
                  </Button>

                  <ProgressBar striped active now={this.state.uploadProgress} label={this.state.uploadProgress + '%'} style={progressBarStyle} />
              </Col>
          </FormGroup>
      </div>;
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(SelectFile));
