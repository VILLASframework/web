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
    let signalsToRender = [];

    if (this.props.simulation) {
      // get selected simulation model
      const simulationModel = this.props.simulation.models.find( model => model.simulator === this.state.widget.simulator );

      // If simulation model update the signals to render
      signalsToRender = simulationModel? simulationModel.mapping : [];
    }

    return (
        <FormGroup controlId="signal">
          <ControlLabel>Signal</ControlLabel>
          <FormControl componentClass="select" placeholder="Select signal" value={this.state.widget.signal} onChange={(e) => this.props.handleChange(e)}>
            {
              signalsToRender.length === 0 ? (
                <option disabled value style={{ display: 'none' }}>No signals available.</option>
              ) : (
                signalsToRender.map((signal, index) => (
                  <option key={index} value={index}>{signal.name}</option>
                ))
              )
            }
          </FormControl>
        </FormGroup>
    );
  }
}

export default EditWidgetSignalControl;