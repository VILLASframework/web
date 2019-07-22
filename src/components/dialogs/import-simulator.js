/**
 * File: new-simulator.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 27.03.2018
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
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import _ from 'lodash';

import Dialog from './dialog';

class ImportSimulatorDialog extends React.Component {
  valid = false;
  imported = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      endpoint: '',
      uuid: ''
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        const data = { 
          properties: {
            name: this.state.name
          },
          uuid: this.state.uuid
        };

        if (this.state.endpoint != null && this.state.endpoint !== "" && this.state.endpoint !== 'http://') {
          data.properties.endpoint = this.state.endpoint;
        }

        this.props.onClose(data);
      }
    } else {
      this.props.onClose();
    }
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  resetState() {
    this.setState({ name: '', endpoint: 'http://', uuid: '' });
  }

  loadFile(fileList) {
    // get file
    const file = fileList[0];
    if (!file.type.match('application/json')) {
      return;
    }

    // create file reader
    const reader = new FileReader();
    const self = this;

    reader.onload = function(event) {
      // read simulator
      const simulator = JSON.parse(event.target.result);
      self.imported = true;
      self.setState({ 
        name: _.get(simulator, 'properties.name') || _.get(simulator, 'rawProperties.name'), 
        endpoint: _.get(simulator, 'properties.endpoint') || _.get(simulator, 'rawProperties.endpoint'),
        uuid: simulator.uuid 
      });
    };

    reader.readAsText(file);
  }

  validateForm(target) {
    // check all controls
    let name = true;
    let uuid = true;

    if (this.state.name === '') {
      name = false;
    }

    if (this.state.uuid === '') {
      uuid = false;
    }

    this.valid = name || uuid;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    if (target === 'uuid') return uuid ? "success" : "error";
  }

  render() {
    return (
      <Dialog show={this.props.show} title="New Simulator" buttonTitle="Add" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="file">
            <FormLabel>Simulator File</FormLabel>
            <FormControl type="file" onChange={(e) => this.loadFile(e.target.files)} />
          </FormGroup>

          <FormGroup controlId="name" validationState={this.validateForm('name')}>
            <FormLabel>Name</FormLabel>
            <FormControl type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="endpoint">
            <FormLabel>Endpoint</FormLabel>
            <FormControl type="text" placeholder="Enter endpoint" value={this.state.endpoint} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="uuid" validationState={this.validateForm('uuid')}>
            <FormLabel>UUID</FormLabel>
            <FormControl type="text" placeholder="Enter uuid" value={this.state.uuid} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default ImportSimulatorDialog;
