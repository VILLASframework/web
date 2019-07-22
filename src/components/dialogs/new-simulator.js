/**
 * File: new-simulator.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
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

import Dialog from './dialog';

class NewSimulatorDialog extends React.Component {
  valid = false;

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
    this.setState({ name: '', endpoint: 'http://', uuid: this.uuidv4()});
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

    this.valid = name && uuid;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    if (target === 'uuid') return uuid ? "success" : "error";
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      // eslint-disable-next-line
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  render() {
    return (
      <Dialog show={this.props.show} title="New Simulator" buttonTitle="Add" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
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

export default NewSimulatorDialog;
