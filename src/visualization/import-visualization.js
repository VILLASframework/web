/**
 * File: import-simulator.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.04.2017
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

import Dialog from '../common/dialogs/dialog';

class ImportVisualizationDialog extends React.Component {
  valid = false;
  imported = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      widgets: [],
      grid: 0
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      this.props.onClose(this.state);
    } else {
      this.props.onClose();
    }
  }

  handleChange(e, index) {
    this.setState({ [e.target.id]: e.target.value });
  }

  resetState() {
    this.setState({ name: '', widgets: [], grid: 0 });

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
      const visualization = JSON.parse(event.target.result);

      let defaultSimulator = "";
      if (self.props.simulation.models != null) {
        defaultSimulator = self.props.simulation.models[0].simulator;
      }

      visualization.widgets.forEach(widget => {
        switch (widget.type) {
          case 'Value':
          case 'Plot':
          case 'Table':
          case 'PlotTable':
          case 'Gauge':
            widget.simulator = defaultSimulator;
            break;

          default:
            break;
        }
      });

      self.imported = true;
      self.valid = true;
      self.setState({ name: visualization.name, widgets: visualization.widgets, grid: visualization.grid });
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

  render() {
    return (
      <Dialog show={this.props.show} title="Import Visualization" buttonTitle="Import" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="file">
            <FormLabel>Visualization File</FormLabel>
            <FormControl type="file" onChange={(e) => this.loadFile(e.target.files)} />
          </FormGroup>

          <FormGroup controlId="name" validationState={this.validateForm('name')}>
            <FormLabel>Name</FormLabel>
            <FormControl readOnly={!this.imported} type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default ImportVisualizationDialog;
