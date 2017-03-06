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

class NewSimulatorDialog extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  valid: false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      simulatorid: '1',
      endpoint: ''
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
    this.setState({ name: '', simulatorid: '1', endpoint: '' });
  }

  validateForm(target) {
    // check all controls
    var simulatorid = true;
    var endpoint = true;
    var name = true;

    if (this.state.name === '') {
      name = false;
    }

    // test if simulatorid is a number (in a string, not type of number)
    if (!/^\d+$/.test(this.state.simulatorid)) {
      simulatorid = false;
    }

    if (this.state.endpoint === '') {
      endpoint = false;
    }

    this.valid = simulatorid && endpoint && name;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    else if (target === 'simulatorid') return simulatorid ? "success" : "error";
    else return endpoint ? "success" : "error";
  }

  render() {
    return (
      <Dialog show={this.props.show} title="New Simulator" buttonTitle="Add" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="name" validationState={this.validateForm('name')}>
            <ControlLabel>Name</ControlLabel>
            <FormControl type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="simulatorid" validationState={this.validateForm('simulatorid')}>
            <ControlLabel>Simulator ID</ControlLabel>
            <FormControl type="number" placeholder="Enter simulator ID" value={this.state.simulatorid} onChange={(e) => this.handleChange(e)} />
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

export default NewSimulatorDialog;
