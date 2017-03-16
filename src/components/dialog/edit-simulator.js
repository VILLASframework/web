/**
 * File: new-simulator.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import Dialog from './dialog';

class EditSimulatorDialog extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    simulator: PropTypes.object.isRequired
  };

  valid: false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      endpoint: '',
      _id: ''
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      this.props.onClose(this.state);
    } else {
      this.props.onClose();
    }
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  resetState() {
    this.setState({
      name: this.props.simulator.name,
      endpoint: this.props.simulator.endpoint,
      _id: this.props.simulator._id
    });
  }

  validateForm(target) {
    // check all controls
    var endpoint = true;
    var name = true;

    if (this.state.name === '') {
      name = false;
    }

    if (this.state.endpoint === '') {
      endpoint = false;
    }

    this.valid = endpoint && name;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    else return endpoint ? "success" : "error";
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Edit Simulator" buttonTitle="save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
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

export default EditSimulatorDialog;