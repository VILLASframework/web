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
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import _ from 'lodash';

import Dialog from '../common/dialogs/dialog';

class ImportSimulationModelDialog extends React.Component {
  imported = false;

  constructor(props) {
    super(props);

    this.state = {
      model: {}
    };
  }

  onClose = canceled => {
    if (canceled) {
      this.props.onClose();

      return;
    }

    this.props.onClose(this.state.model);
  }

  resetState = () => {
    this.setState({
      model: {}
    });

    this.imported = false;
  }

  loadFile = event => {
    // get file
    const file = event.target.files[0];
    if (file.type.match('application/json') === false) {
      return;
    }

    // create file reader
    const reader = new FileReader();
    const self = this;

    reader.onload = event => {
      const model = JSON.parse(event.target.result);

      model.simulator = this.props.simulators.length > 0 ? this.props.simulators[0]._id : null;

      self.imported = true;

      this.setState({ model });
    };

    reader.readAsText(file);
  }

  handleSimulatorChange = event => {
    const model = this.state.model;

    model.simulator = event.target.value;

    this.setState({ model });
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Import Simulation Model" buttonTitle="Import" onClose={this.onClose} onReset={this.resetState} valid={this.imported}>
        <form>
          <FormGroup controlId='file'>
            <FormLabel>Simulation Model File</FormLabel>
            <FormControl type='file' onChange={this.loadFile} />
          </FormGroup>

          <FormGroup controlId='simulator'>
            <FormLabel>Simulator</FormLabel>
            <FormControl disabled={this.imported === false} componentClass='select' placeholder='Select simulator' value={this.state.model.simulator} onChange={this.handleSimulatorChange}>
              {this.props.simulators.map(simulator => (
                <option key={simulator.id} value={simulator.id}>{_.get(simulator, 'properties.name') || _.get(simulator, 'rawProperties.name')}</option>
              ))}
            </FormControl>
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default ImportSimulationModelDialog;
