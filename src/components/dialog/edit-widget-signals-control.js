/**
 * File: edit-widget-signals-control.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 03.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, Checkbox, ControlLabel } from 'react-bootstrap';

class EditWidgetSignalsControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        simulator: '',
        preselectedSignals: []
      }
    };
  }

  componentWillReceiveProps(nextProps) {
      // Update state's widget with props
    this.setState({ widget: nextProps.widget });
  }

  handleSignalChange(checked, index) {
    var signals = this.state.widget.preselectedSignals;
    var new_signals;

    if (checked) {
      // add signal
      new_signals = signals.concat(index);
    } else {
      // remove signal
      new_signals = signals.filter( (idx) => idx !== index );
    }

    this.props.handleChange({ target: { id: 'preselectedSignals', value: new_signals } });
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
        <FormGroup>
          <ControlLabel>Signals</ControlLabel>
          {simulationModel.mapping.map((signal, index) => (
            <Checkbox key={index} checked={this.state.widget.preselectedSignals.indexOf(index) !== -1} onChange={(e) => this.handleSignalChange(e.target.checked, index)}>{signal.name}</Checkbox>
          ))}
        </FormGroup>
    );
  }
}

export default EditWidgetSignalsControl;