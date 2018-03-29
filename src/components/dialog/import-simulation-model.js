/**
 * File: import-simulation-model.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.09.2017
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

import Table from '../table';
import TableColumn from '../table-column';
import Dialog from './dialog';

class ImportSimulationModelDialog extends React.Component {
  valid = false;
  imported = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      simulator: '',
      outputLength: '1',
      inputLength: '1',
      outputMapping: [ { name: 'Signal', type: 'Type' } ],
      inputMapping: [{ name: 'Signal', type: 'Type' }]
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      this.props.onClose(this.state);
    } else {
      this.props.onClose();
    }
  }

  resetState() {
    this.setState({
      name: '',
      simulator: '',
      outputLength: '1',
      inputLength: '1',
      outputMapping: [{ name: 'Signal', type: 'Type' }],
      inputMapping: [{ name: 'Signal', type: 'Type' }]
    });

    this.imported = false;
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

  loadFile(fileList) {
    // get file
    const file = fileList[0];
    if (!file.type.match('application/json')) {
      return;
    }

    // create file reader
    var reader = new FileReader();
    var self = this;

    reader.onload = function(event) {
      // read simulator
      const model = JSON.parse(event.target.result);

      self.imported = true;
      self.valid = true;
      self.setState({ name: model.name, mapping: model.mapping, length: model.length, simulator: { node: self.props.nodes[0]._id, simulator: 0 } });
    };

    reader.readAsText(file);
  }

  validateForm(target) {
    // check all controls
    var name = true;
    let inputLength = true;
    let outputLength = true;
    var simulator = true;

    if (this.state.name === '') {
      name = false;
    }

    if (this.state.simulator === '') {
      simulator = false;
    }

    // test if simulatorid is a number (in a string, not type of number)
    if (!/^\d+$/.test(this.state.outputLength)) {
      outputLength = false;
    }

    if (!/^\d+$/.test(this.state.inputLength)) {
      inputLength = false;
    }

    this.valid = name && inputLength && outputLength && simulator;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    else if (target === 'outputLength') return outputLength ? "success" : "error";
    else if (target === 'inputLength') return inputLength ? "success" : "error";
    else if (target === 'simulator') return simulator ? "success" : "error";
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Import Simulation Model" buttonTitle="Import" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="file">
            <ControlLabel>Simulation Model File</ControlLabel>
            <FormControl type="file" onChange={(e) => this.loadFile(e.target.files)} />
          </FormGroup>

          <FormGroup controlId="name" validationState={this.validateForm('name')}>
            <ControlLabel>Name</ControlLabel>
            <FormControl readOnly={!this.imported} type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="simulator">
            <ControlLabel>Simulator</ControlLabel>
            <FormControl readOnly={!this.imported} componentClass="select" placeholder="Select simulator" value={this.state.simulator} onChange={(e) => this.handleChange(e)}>
              {this.props.simulators.map(simulator => (
                <option key={simulator._id} value={simulator}>{simulator.rawProperties.name}</option>
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

export default ImportSimulationModelDialog;
