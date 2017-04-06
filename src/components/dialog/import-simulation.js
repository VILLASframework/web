/**
 * File: import-simulation.js
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
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import Dialog from './dialog';

class ImportSimulationDialog extends React.Component {
  valid = false;
  imported = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      selectedModels: []
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      // create simulation
      const simulation = {
        name: this.state.name,
        models: this.props.simulation.models.filter((element, index) => {
          return this.state.selectedModels[index];
        })
      };

      this.props.onClose(simulation);
    } else {
      this.props.onClose();
    }
  }

  handleChange(e, index) {
    if (e.target.id === 'simulator') {
      const models = this.state.models;
      models[index].simulator = JSON.parse(e.target.value);

      this.setState({ models });
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
  }

  resetState() {
    this.setState({ name: '', models: [] });

    this.imported = false;
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
      const simulation = JSON.parse(event.target.result);
      simulation.models.forEach(model => {
        model.simulator = {
          node: self.props.nodes[0]._id,
          simulator: 0
        }
      });

      self.imported = true;
      self.setState({ name: simulation.name, models: simulation.models });
    };

    reader.readAsText(file);
  }

  validateForm(target) {
    // check all controls
    let name = true;

    if (this.state.name === '') {
      name = false;
    }

    this.valid =  name;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
  }

  selectModels(event) {
    // update selection
    const selectedModels = this.state.selectedModels.map((element, index) => {
      // eslint-disable-next-line
      if (event.target.id == index) {
        return !element;
      } else {
        return element;
      }
    });

    this.setState({ selectedModels: selectedModels });
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Import Simulation" buttonTitle="Import" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="file">
            <ControlLabel>Simulation File</ControlLabel>
            <FormControl type="file" onChange={(e) => this.loadFile(e.target.files)} />
          </FormGroup>

          <FormGroup controlId="name" validationState={this.validateForm('name')}>
            <ControlLabel>Name</ControlLabel>
            <FormControl readOnly={!this.imported} type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>

          {this.state.models.map((model, index) => (
            <FormGroup controlId="simulator" key={index}>
              <ControlLabel>{model.name} - Simulator</ControlLabel>
              <FormControl componentClass="select" placeholder="Select simulator" value={JSON.stringify({ node: model.simulator.node, simulator: model.simulator.simulator})} onChange={(e) => this.handleChange(e, index)}>
                {this.props.nodes.map(node => (
                  node.simulators.map((simulator, index) => (
                    <option key={node._id + index} value={JSON.stringify({ node: node._id, simulator: index })}>{node.name}/{simulator.name}</option>
                  ))
                ))}
              </FormControl>
            </FormGroup>
          ))}
        </form>
      </Dialog>
    );
  }
}

export default ImportSimulationDialog;
