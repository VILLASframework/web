/**
 * File: new-simulation-model.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
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
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';

import Table from '../table';
import TableColumn from '../table-column';
import Dialog from './dialog';

class NewSimulationModelDialog extends React.Component {
  valid = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      simulator: '',
      outputLength: '1',
      inputLength: '1',
      outputMapping: [ { name: 'Signal', type: 'Type' } ],
      inputMapping: [ { name: 'Signal', type: 'Type' } ]
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
    let mapping = null;

    if (e.target.id === 'outputLength') {
      mapping = this.state.outputMapping;
    } else if (e.target.id === 'inputLength') {
      mapping = this.state.inputMapping;
    }

    if (mapping != null) {
      // change mapping size
      if (e.target.value > mapping.length) {
        // add missing signals
        while (mapping.length < e.target.value) {
          mapping.push({ name: 'Signal', type: 'Type' });
        }
      } else {
        // remove signals
        mapping.splice(e.target.value, mapping.length - e.target.value);
      }
    }

    this.setState({ [e.target.id]: e.target.value });
  }

  handleMappingChange(key, event, row, column) {
    const mapping = this.state[key];

    if (column === 1) {
      mapping[row].name = event.target.value;
    } else if (column === 2) {
      mapping[row].type = event.target.value;
    }

    this.setState({ [key]: mapping });
  }

  resetState() {
    this.setState({
      name: '',
      simulator: this.props.simulators[0]._id || '',
      outputLength: '1',
      inputLength: '1',
      outputMapping: [{ name: 'Signal', type: 'Type' }],
      inputMapping: [{ name: 'Signal', type: 'Type' }]
    });
  }

  validateForm(target) {
    // check all controls
    let name = true;
    let inputLength = true;
    let outputLength = true;

    if (this.state.name === '') {
      name = false;
    }

    // test if simulatorid is a number (in a string, not type of number)
    if (!/^\d+$/.test(this.state.outputLength)) {
      outputLength = false;
    }

    if (!/^\d+$/.test(this.state.inputLength)) {
      inputLength = false;
    }

    this.valid = name && inputLength && outputLength;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    else if (target === 'outputLength') return outputLength ? "success" : "error";
    else if (target === 'inputLength') return inputLength ? "success" : "error";
  }

  render() {
    return (
      <Dialog show={this.props.show} title="New Simulation Model" buttonTitle="Add" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="name" validationState={this.validateForm('name')}>
            <ControlLabel>Name</ControlLabel>
            <FormControl type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="simulator">
            <ControlLabel>Simulator</ControlLabel>
            <FormControl componentClass="select" placeholder="Select simulator" value={this.state.simulator} onChange={(e) => this.handleChange(e)}>
              {this.props.simulators.map(simulator => (
                <option key={simulator._id} value={simulator._id}>{_.get(simulator, 'properties.name') || _.get(simulator, 'rawProperties.name')}</option>
              ))}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="outputLength" validationState={this.validateForm('outputLength')}>
            <ControlLabel>Output Length</ControlLabel>
            <FormControl type="number" placeholder="Enter length" min="1" value={this.state.outputLength} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="outputMapping">
            <ControlLabel>Output Mapping</ControlLabel>
            <HelpBlock>Click Name or Type cell to edit</HelpBlock>
            <Table data={this.state.outputMapping}>
              <TableColumn title='ID' width='60' dataIndex />
              <TableColumn title='Name' dataKey='name' inlineEditable onInlineChange={(event, row, column) => this.handleMappingChange('outputMapping', event, row, column)} />
              <TableColumn title='Type' dataKey='type' inlineEditable onInlineChange={(event, row, column) => this.handleMappingChange('outputMapping', event, row, column)} />
            </Table>
          </FormGroup>
          <FormGroup controlId="inputLength" validationState={this.validateForm('inputLength')}>
            <ControlLabel>Input Length</ControlLabel>
            <FormControl type="number" placeholder="Enter length" min="1" value={this.state.inputLength} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="inputMapping">
            <ControlLabel>Input Mapping</ControlLabel>
            <HelpBlock>Click Name or Type cell to edit</HelpBlock>
            <Table data={this.state.inputMapping}>
              <TableColumn title='ID' width='60' dataIndex />
              <TableColumn title='Name' dataKey='name' inlineEditable onInlineChange={(event, row, column) => this.handleMappingChange('inputMapping', event, row, column)} />
              <TableColumn title='Type' dataKey='type' inlineEditable onInlineChange={(event, row, column) => this.handleMappingChange('inputMapping', event, row, column)} />
            </Table>
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default NewSimulationModelDialog;
