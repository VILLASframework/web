/**
 * File: edit-widget-signals-control.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 03.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, Checkbox, ControlLabel, FormControl } from 'react-bootstrap';

class EditWidgetSignalsControl extends Component {
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

  handleSignalChange(checked, index) {
    var signals = this.state.widget[this.props.controlId];
    var new_signals;

    if (checked) {
      // add signal
      new_signals = signals.concat(index);
    } else {
      // remove signal
      new_signals = signals.filter( (idx) => idx !== index );
    }

    this.props.handleChange({ target: { id: this.props.controlId, value: new_signals } });
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
        <FormGroup>
          <ControlLabel>Signals</ControlLabel>
          {
            signalsToRender.length === 0 || !this.state.widget.hasOwnProperty(this.props.controlId)? (
              <FormControl.Static>No signals available.</FormControl.Static>
            ) : (
              signalsToRender.map((signal, index) => (
                <Checkbox key={index} checked={this.state.widget[this.props.controlId].indexOf(index) !== -1} onChange={(e) => this.handleSignalChange(e.target.checked, index)}>{signal.name}</Checkbox>
                ))
            )
          }
        </FormGroup>
    );
  }
}

export default EditWidgetSignalsControl;