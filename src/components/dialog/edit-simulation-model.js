/**
 * File: edit-simulation-model.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import Table from '../table';
import TableColumn from '../table-column';
import Dialog from './dialog';

class EditSimulationModelDialog extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    simulators: PropTypes.array.isRequired
  };

  valid: false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      simulator: '',
      length: 1
    }
  }

  onClose(canceled) {
    if (canceled === false) {
      this.props.onClose(this.state);
    } else {
      this.props.onClose();
    }
  }

  handleChange(e) {
    if (e.target.id === 'length') {
      // change mapping size
      if (e.target.value > this.state.mapping.length) {
        // add missing signals
        while (this.state.mapping.length < e.target.value) {
          this.state.mapping.push({ name: 'Signal', type: 'Type' });
        }
      } else {
        // remove signals
        this.state.mapping.splice(e.target.value, this.state.mapping.length - e.target.value);
      }
    }

    this.setState({ [e.target.id]: e.target.value });
  }
  
  handleMappingChange(event, row, column) {
    var mapping = this.state.mapping;

    if (column === 1) {
      mapping[row].name = event.target.value;
    } else if (column === 2) {
      mapping[row].type = event.target.value;
    }

    this.setState({ mapping: mapping });
  }

  resetState() {
    this.setState({
      name: this.props.data.name,
      simulator: this.props.data.simulator,
      length: this.props.data.length,
      mapping: this.props.data.mapping
    });
  }

  validateForm(target) {
    // check all controls
    var name = true;
    var length = true;

    if (this.state.name === '') {
      name = false;
    }

    // test if simulatorid is a number (in a string, not type of number)
    if (!/^\d+$/.test(this.state.length)) {
      length = false;
    }

    this.valid = name && length;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    else if (target === 'length') return length ? "success" : "error";
  }

  render() {
    return (
      <Dialog show={this.props.show} title="New Simulation Model" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="name" validationState={this.validateForm('name')}>
            <ControlLabel>Name</ControlLabel>
            <FormControl type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="simulator" validationState={this.validateForm('simulator')}>
            <ControlLabel>Simulator</ControlLabel>
            <FormControl componentClass="select" placeholder="Select simulator" value={this.state.simulator} onChange={(e) => this.handleChange(e)}>
              {this.props.simulators.map(simulator => (
                <option key={simulator._id} value={simulator._id}>{simulator.name}</option>
              ))}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="length" validationState={this.validateForm('length')}>
            <ControlLabel>Length</ControlLabel>
            <FormControl type="number" placeholder="Enter length" min="1" value={this.state.length} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="mapping">
            <ControlLabel>Mapping</ControlLabel>
            <Table data={this.state.mapping}>
              <TableColumn title='ID' width='60' dataIndex />
              <TableColumn title='Name' dataKey='name' inlineEditable onInlineChange={(event, row, column) => this.handleMappingChange(event, row, column)} />
              <TableColumn title='Type' dataKey='type' inlineEditable onInlineChange={(event, row, column) => this.handleMappingChange(event, row, column)} />
            </Table>
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default EditSimulationModelDialog;