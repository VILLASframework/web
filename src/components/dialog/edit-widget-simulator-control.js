/**
 * File: edit-widget-simulator-control.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 03.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class EditWidgetSimulatorControl extends Component {
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

    return (
        <FormGroup controlId="simulator">
            <ControlLabel>Simulator</ControlLabel>
            <FormControl componentClass="select" placeholder="Select simulator" value={this.state.widget.simulator || '' } onChange={(e) => this.props.handleChange(e)}>
            {
              this.props.simulation.models.length === 0? (
              <option disabled value style={{ display: 'none' }}> No simulators available. </option>
            ) : (
              this.props.simulation.models.map((model, index) => (
                <option key={index} value={model.simulator}>{model.name}</option>
              )))
            }
            </FormControl>
        </FormGroup>
    );
  }
}

export default EditWidgetSimulatorControl;