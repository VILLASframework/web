/**
 * File: edit-widget-signal-control.js
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
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';

class EditWidgetSignalControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        simulationModel: ''
      }
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget
    };
  }

  render() {
    const simulationModel = this.props.simulationModels.find(m => m._id === this.state.widget.simulationModel);

    let signalsToRender = [];

    if (simulationModel != null) {
      if (this.props.input) {
        signalsToRender = simulationModel ? simulationModel.inputMapping : [];
      } else {
        signalsToRender = simulationModel ? simulationModel.outputMapping : [];
      }
    }

    return (
        <FormGroup controlId="signal">
          <FormLabel>Signal</FormLabel>
          <FormControl as="select" placeholder="Select signal" value={this.state.widget.signal} onChange={(e) => this.props.handleChange(e)}>
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
