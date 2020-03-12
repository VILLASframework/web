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
import { FormGroup, FormControl, FormLabel, Button, Col } from 'react-bootstrap';

import FileStore from './file-store';
import LoginStore from '../user/login-store';

import AppDispatcher from '../common/app-dispatcher';
import Icon from "../common/icon";

class SelectFile extends React.Component {
  static getStores() {
      return [ FileStore, LoginStore ];
  }


  static calculateState(prevState, props) {

    let files = FileStore.getState().filter((file) => {
      return (file.configID === props.objectID)
    });

    console.log("props.objectID=", props.objectID)

      return {
          files: files,
          sessionToken: LoginStore.getState().token,
          selectedFile: '',
          uploadFile: null,
          uploadProgress: 0
      };
  }

  /*componentDidMount() {
      AppDispatcher.dispatch({
          type: 'files/start-load',
          token: this.state.sessionToken
      });
  }*/

  static getDerivedStateFromProps(props, state){


  }

  handleChange(event) {

      // send file ID to callback
      if (this.props.onChange != null) {
          this.props.onChange(event.target.value);
      }
  };

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
          token: this.state.sessionToken,
          //progressCallback: this.updateUploadProgress,
          //finishedCallback: this.clearProgress,
          objectType: this.props.type,
          objectID: this.props.objectID,
      });
  };

  updateUploadProgress = (event) => {// TODO: this callback does not work properly (access to setState)
      this.setState({ uploadProgress: parseInt(event.percent.toFixed(), 10) });
  };

  clearProgress = () => { // TODO this callback does not work properly (access to setState)
      if (this.props.onChange != null) {
        this.props.onChange(this.state.files[this.state.files.length - 1].id);
      }
      this.setState({ uploadProgress: 0 });
  };

  render() {

      let fileOptions;
      if (this.state.files.length > 0){
        fileOptions = this.state.files.map(f =>
          <option key={f.id} value={f.id}>{f.name}</option>
        );
      } else {
        fileOptions = <option >No files for this component config</option>
      }

      /*const progressBarStyle = {
          marginLeft: '100px',
          marginTop: '-25px'
      };*/

      return <div>
          <FormGroup>
              <FormLabel sm={3} md={2}>
                  {this.props.name}
              </FormLabel>

              <FormGroup as={Col} sm={9} md={10}>
                  <FormControl as="select" disabled={this.props.disabled} placeholder='Select file' onChange={(event) => this.handleChange(event)}>
                      {fileOptions}
                  </FormControl>
              </FormGroup>
          </FormGroup>

          <FormGroup as={Col} sm={{span: 9, offset: 3}} md={{span: 10, offset: 2}} >
                  <FormControl disabled={this.props.disabled} type='file' onChange={(event) => this.selectUploadFile(event)} />
          </FormGroup>

          <FormGroup as={Col} sm={{span: 9, offset: 3}} md={{span: 10, offset : 2}}>
                  <Button disabled={this.props.disabled} onClick={() => this.startFileUpload()}>
                    <Icon icon="plus" /> File
                  </Button>
          </FormGroup>
        {/*<FormGroup as={Col} sm={{span: 9, offset: 3}} md={{span: 10, offset: 2}}>
          <ProgressBar striped animated now={this.state.uploadProgress} label={this.state.uploadProgress + '%'}
                       style={progressBarStyle}/>
        </FormGroup>
        */}
      </div>;
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(SelectFile), { withProps: true });
