/**
 * File: import-simulator.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import Dialog from './dialog';

class ImportNodeDialog extends React.Component {
  valid = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
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
    this.setState({ name: '', endpoint: '' });
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
      const simulator = JSON.parse(event.target.result);
      self.valid = true;
      self.setState({ name: simulator.name, endpoint: simulator.endpoint });
    };

    reader.readAsText(file);
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Import Simulator" buttonTitle="Import" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="file">
            <ControlLabel>Simulator File</ControlLabel>
            <FormControl type="file" onChange={(e) => this.loadFile(e.target.files)} />
          </FormGroup>

          <FormGroup controlId="name">
            <ControlLabel>Name</ControlLabel>
            <FormControl readOnly type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="endpoint">
            <ControlLabel>Endpoint</ControlLabel>
            <FormControl readOnly type="text" placeholder="Enter endpoint" value={this.state.endpoint} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default ImportNodeDialog;
