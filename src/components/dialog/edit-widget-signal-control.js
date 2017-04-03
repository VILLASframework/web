/**
 * File: edit-widget-signal-control.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 03.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class EditWidgetSignalControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        simulator: ''
      }
    };
  }

  componentWillReceiveProps(nextProps) {
      // Update state's widget with props
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
        <FormGroup controlId="signal">
          <ControlLabel>Signal</ControlLabel>
          <FormControl componentClass="select" placeholder="Select signal" value={this.state.widget.signal} onChange={(e) => this.props.handleChange(e)}>
            {simulationModel.mapping.map((signal, index) => (
              <option key={index} value={index}>{simulationModel.mapping[index].name}</option>
            ))}
          </FormControl>
        </FormGroup>
    );
  }
}

export default EditWidgetSignalControl;