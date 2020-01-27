/**
 * File: edit-widget-signals-control.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 03.04.2017
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
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, FormCheck, FormLabel } from 'react-bootstrap';

class EditWidgetSignalsControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        simulator: {}
      }
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget
    };
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
    const simulationModel = this.props.simulationModels.find(m => m._id === this.state.widget.simulationModel);

    let signalsToRender = [];

    if (simulationModel != null) {
      // If simulation model update the signals to render
      signalsToRender = simulationModel ? simulationModel.outputMapping : [];
    }

    return (
        <FormGroup>
          <FormLabel>Signals</FormLabel>
          {
            signalsToRender.length === 0 || !this.state.widget.hasOwnProperty(this.props.controlId)? (
              <FormLabel>No signals available</FormLabel>
            ) : (
              signalsToRender.map((signal, index) => (
                <FormCheck key={index} checked={this.state.widget[this.props.controlId].indexOf(index) !== -1} onChange={(e) => this.handleSignalChange(e.target.checked, index)}>{signal.name}</FormCheck>
                ))
            )
          }
        </FormGroup>
    );
  }
}

export default EditWidgetSignalsControl;
