/**
 * File: import-node.js
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

class ImportNodeDialog extends React.Component {
  valid = false;
  imported = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      endpoint: '',
      simulators: []
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
    if (e.target.type === 'checkbox') {
      this.setState({ [e.target.id]: e.target.checked });
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
  }

  resetState() {
    this.setState({ name: '', endpoint: '' });

    this.imported = false;
  }

  loadFile(fileList) {
    // get file
    const file = fileList[0];
    if (!file.type.match('application/json')) {
      return;
    }

    // create file reader
    const reader = new FileReader();
    const self = this;

    reader.onload = function(event) {
      // read simulator
      const node = JSON.parse(event.target.result);
      self.imported = true;
      self.setState({ name: node.name, endpoint: node.endpoint, simulators: node.simulators });
    };

    reader.readAsText(file);
  }

  validateForm(target) {
    // check all controls
    let endpoint = true;
    let name = true;

    if (this.state.name === '' || this.props.nodes.find(node => node.name === this.state.name) !== undefined) {
      name = false;
    }

    if (this.state.endpoint === '' || this.props.nodes.find(node => node.endpoint === this.state.endpoint) !== undefined) {
      endpoint = false;
    }

    this.valid = endpoint && name;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    else return endpoint ? "success" : "error";
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Import Simulator" buttonTitle="Import" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="file">
            <ControlLabel>Simulator File</ControlLabel>
            <FormControl type="file" onChange={(e) => this.loadFile(e.target.files)} />
          </FormGroup>

          <FormGroup controlId="name" validationState={this.validateForm('name')}>
            <ControlLabel>Name</ControlLabel>
            <FormControl readOnly={!this.imported} type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="endpoint" validationState={this.validateForm('endpoint')}>
            <ControlLabel>Endpoint</ControlLabel>
            <FormControl readOnly={!this.imported} type="text" placeholder="Enter endpoint" value={this.state.endpoint} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default ImportNodeDialog;
