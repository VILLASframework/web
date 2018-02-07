/**
 * File: edit-node.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 06.07.2017
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
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import Dialog from './dialog';

class NewNodeDialog extends React.Component {
  valid: false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      endpoint: '',
      config: {},
      simulators: [],
      _id: ''
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        this.props.onClose(this.state);
      }
    } else {
      this.props.onClose();
    }
  }

  handleChange(e) {
    if (e.target.type === 'checkbox') {
      this.setState({ [e.target.id]: e.target.checked });
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
  }

  resetState() {
    this.setState({ name: this.props.node.name, endpoint: this.props.node.endpoint, config: this.props.node.config, simulators: this.props.node.simulators, _id: this.props.node._id });
  }

  validateForm(target) {
    // check all controls
    var endpoint = true;
    var name = true;

    if (this.state.name === '' || this.props.nodes.find(node => node._id !== this.state._id && node.name === this.state.name) !== undefined) {
      name = false;
    }

    if (this.state.endpoint === '' || this.props.nodes.find(node => node._id !== this.state._id && node.endpoint === this.state.endpoint) !== undefined) {
      endpoint = false;
    }

    this.valid = endpoint && name;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    else return endpoint ? "success" : "error";
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Edit Node" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="name" validationState={this.validateForm('name')}>
            <ControlLabel>Name</ControlLabel>
            <FormControl type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="endpoint" validationState={this.validateForm('endpoint')}>
            <ControlLabel>Endpoint</ControlLabel>
            <FormControl type="text" placeholder="Enter endpoint" value={this.state.endpoint} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default NewNodeDialog;
