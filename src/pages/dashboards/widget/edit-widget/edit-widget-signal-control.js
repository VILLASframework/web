/**
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
import { Form } from 'react-bootstrap';

class EditWidgetSignalControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {},
      signals: []
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget,
      signals: props.signals.filter(s => s.direction === props.direction)
    };
  }

  handleSignalChange(e){

    let tempSignal = parseInt(e.target.value,10);
    let newSignal = [];
    newSignal.push(tempSignal);

    this.props.handleChange({ target: { id: this.props.controlId, value: newSignal } });

  }

  render() {

    return (
        <Form.Group controlId="signal" style={this.props.style}>
          <Form.Label>Select signal</Form.Label>
          <Form.Control as="select" value={this.props.widget.signalIDs[0] || ""} onChange={(e) => this.handleSignalChange(e)}>
          <option default>Select signal</option>
            {
              this.state.signals.length === 0 ? (
                <option disabled value style={{ display: 'none' }}>No signals available.</option>
              ) : (
                this.state.signals.map((signal, index) => (
                  <option key={index} value={signal.id}>{signal.name}</option>
                ))
              )
            }
          </Form.Control>
        </Form.Group>
    );
  }
}

export default EditWidgetSignalControl;
