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
import { Form, Button, Col, ProgressBar } from 'react-bootstrap';
import AppDispatcher from '../common/app-dispatcher';

class SelectFile extends React.Component {

  constructor() {
    super();

    this.state = {
      uploadFile: null,
      uploadProgress: 0
    }
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

      // TODO make sure that edit config dialog remains open after clicking "Upload" button
  };

  updateUploadProgress = (event) => {
      this.setState({ uploadProgress: parseInt(event.percent.toFixed(), 10) });
  };

  clearProgress = (newFileID) => {
      /*if (this.props.onChange != null) {
        let event = {}
        event["target"] = {}
        event.target["value"] = newFileID
        this.props.onChange(event);
      }
      this.setState({ uploadProgress: 0 });
      */

  };

  render() {

      let fileOptions = [];
      if (this.props.files.length > 0){
        fileOptions.push(
          <option key = {0} value={-1}>Select file</option>
        )

        fileOptions.push(this.props.files.map(f =>
          <option key={f.id} value={f.id}>{f.name}</option>
        ));
      } else {
        fileOptions = <option >No files available</option>
      }

      const progressBarStyle = {
          marginLeft: '100px',
          marginTop: '-40px'
      };

      return <div>
          <Form.Group>
              <Form.Label sm={3} md={2}>
                  {this.props.name}
              </Form.Label>

              <Form.Group as={Col} sm={9} md={10}>
                  <Form.Control
                    as="select"
                    value={this.props.value}
                    disabled={this.props.disabled}
                    placeholder='Select file'
                    onChange={(event) => this.props.onChange(event)}>
                      {fileOptions}
                  </Form.Control>
              </Form.Group>
          </Form.Group>

          <Form.Group as={Col} >
                  <Form.Control
                    disabled={this.props.disabled}
                    type='file'
                    onChange={(event) => this.selectUploadFile(event)} />
          </Form.Group>

          <Form.Group as={Col} >
                  <Button
                    disabled={this.state.uploadFile === null}
                    onClick={() => this.startFileUpload()}>
                    Upload
                  </Button>
          </Form.Group>

        <Form.Group as={Col} >
          <ProgressBar
            striped={true}
            animated={true}
            now={this.state.uploadProgress}
            label={this.state.uploadProgress + '%'}
            style={progressBarStyle}
          />
        </Form.Group>

      </div>;
  }
}

export default SelectFile;
