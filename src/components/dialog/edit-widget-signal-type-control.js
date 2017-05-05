/**
 * File: edit-widget-signal-type-control.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 03.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class EditWidgetSignalTypeControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {}
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

    // Obtain unique signal types with the help of dictionary keys
    var signalTypes = Object.keys(simulationModel.mapping.reduce( (collection, signal) => {
        var lower = signal.type.toLowerCase();
        collection[lower] = '';
        return collection;
      }, {}));

    var capitalize = (str) => { return str.charAt(0).toUpperCase() + str.slice(1); }
    
    var selectedValue = signalTypes.includes(this.state.widget.signalType) ? this.state.widget.signalType : '';

    return (
        <FormGroup controlId="signalType">
          <ControlLabel>Signal type</ControlLabel>
          <FormControl componentClass="select" placeholder="Select signal type" value={ selectedValue } onChange={(e) => this.props.handleChange(e)}>
            <option disabled value style={{ display: 'none' }}> Select signal type </option>
            {signalTypes.map((type, index) => (
              <option key={type} value={type}>{ capitalize(type) }</option>
            ))}
          </FormControl>
        </FormGroup>
    );
  }
}

export default EditWidgetSignalTypeControl;