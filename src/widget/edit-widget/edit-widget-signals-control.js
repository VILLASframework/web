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
      widget: { }
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget
    };
  }

  handleSignalChange(checked, signalID) {
    var signals = this.state.widget.signalIDs;
    var new_signals;

    if (checked) {
      // add signal
      new_signals = signals.concat(signalID);
    } else {
      // remove signal
      new_signals = signals.filter( (id) => id !== signalID );
    }

    this.props.handleChange({ target: { id: this.props.controlId, value: new_signals } });
  }

  render() {
    return (
        <FormGroup>
          <FormLabel>Signals</FormLabel>
          {
            this.props.signals === 0 || !this.state.widget.hasOwnProperty(this.props.controlId)? (
              <FormLabel>No signals available</FormLabel>
            ) : (
              this.props.signals.map((signal, index) => (
                <FormCheck key={signal.id} checked={this.state.widget.signalIDs.indexOf(signal.id) !== -1} onChange={(e) => this.handleSignalChange(e.target.checked, signal.id)}>{signal.name}</FormCheck>
                ))
            )
          }
        </FormGroup>
    );
  }
}

export default EditWidgetSignalsControl;
