/**
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
import {FormGroup, FormControl, FormLabel, Col} from 'react-bootstrap';

import Dialog from '../common/dialogs/dialog';
import ParametersEditor from '../common/parameters-editor';

class ImportScenarioDialog extends React.Component {
  valid = false;
  imported = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      running: '',
      configs: [],
      dashboards: [],
      startParameters: {}
    };
  }

  onClose = canceled => {
    if (canceled) {
      if (this.props.onClose != null) {
        this.props.onClose();
      }

      return;
    }

    if (this.valid && this.props.onClose != null) {
      this.props.onClose(this.state);
    }
  }

  handleChange(e, index) {
    /*if (e.target.id === 'icID') {
      const configs = this.state.configs;
      configs[index].icID = JSON.parse(e.target.value);

      this.setState({ configs: configs });

      return;
    }*/

    this.setState({ [e.target.id]: e.target.value });

    // check all controls
    let name = true;

    if (this.state.name === '') {
      name = false;
    }

    this.valid =  name;
  }

  resetState = () => {
    this.setState({ name: '', configs: [], startParameters: {} });

    this.imported = false;
  }

  loadFile = event => {
    const file = event.target.files[0];

    if (!file.type.match('application/json')) {
      return;
    }

    // create file reader
    const reader = new FileReader();
    const self = this;

    reader.onload = onloadEvent => {
      const scenario = JSON.parse(onloadEvent.target.result);

      self.imported = true;
      self.valid = true;
      self.setState({ name: scenario.name, configs: scenario.configs, dashboards: scenario.dashboards, startParameters: scenario.startParameters, running: scenario.running });
    };

    reader.readAsText(file);
  }

  render() {
    return <Dialog show={this.props.show} title="Import Scenario" buttonTitle="Import" onClose={this.onClose} onReset={this.resetState} valid={this.valid}>
      <form>
        <FormGroup as={Col} controlId="file">
          <FormLabel>Scenario File</FormLabel>
          <FormControl type="file" onChange={this.loadFile} />
        </FormGroup>

        <FormGroup as={Col} controlId="name">
          <FormLabel>Name</FormLabel>
          <FormControl readOnly={this.imported === false} type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup as={Col}>
          <FormLabel>Start Parameters</FormLabel>

          <ParametersEditor content={this.state.startParameters} onChange={this.handleStartParametersChange} disabled={this.imported === false} />
        </FormGroup>

      </form>
    </Dialog>;
  }
}

export default ImportScenarioDialog;
