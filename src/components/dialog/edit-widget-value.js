/**
 * File: edit-widget-value.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class EditValueWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        simulator: '',
        signal: 0
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ widget: nextProps.widget });
  }

  render() {
    // get selected simulation model
    var simulationModel = {};

    if (this.props.simulation) {
      this.props.simulation.models.forEach((model) => {
        if (model.simulation === this.state.widget.simulation) {
          simulationModel = model;
        }
      });
    }

    return (
      <div>
        <FormGroup controlId="simulator">
          <ControlLabel>Simulator</ControlLabel>
          <FormControl componentClass="select" placeholder="Select simulator" value={this.state.widget.simulator} onChange={(e) => this.props.handleChange(e)}>
            {this.props.simulation.models.map((model, index) => (
              <option key={index} value={model.simulator}>{model.name}</option>
            ))}
          </FormControl>
        </FormGroup>
        <FormGroup controlId="signal">
          <ControlLabel>Signal</ControlLabel>
          <FormControl componentClass="select" placeholder="Select signal" value={this.state.widget.signal} onChange={(e) => this.props.handleChange(e)}>
            {simulationModel.mapping.map((signal, index) => (
              <option key={index} value={index}>{simulationModel.mapping[index].name}</option>
            ))}
          </FormControl>
        </FormGroup>
      </div>
    );
  }
}

export default EditValueWidget;
