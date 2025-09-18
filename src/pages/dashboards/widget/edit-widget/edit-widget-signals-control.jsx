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

class EditWidgetSignalsControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {},
      signals: [],
      checkedSignals: props.widget[props.controlId]
    };
  }


  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget,
      signals: props.signals.filter(s => s.direction === props.direction),
      checkedSignals: props.widget[props.controlId]
    };
  }

  handleSignalChange(checked, signalID) {
    let new_signals = this.state.checkedSignals;

    if (checked) {
      // add signal
      new_signals = new_signals.concat(signalID);
    } else {
      // remove signal
      new_signals = new_signals.filter( (id) => id !== signalID );
    }

    this.setState({checkedSignals: new_signals})
    this.props.handleChange({ target: { id: this.props.controlId, value: new_signals, type:'checkbox' } });
  }

  render() {
    return (
        <Form.Group style={this.props.style}>
          <Form.Label>Signals</Form.Label>
          {
            this.state.signals === 0 || !this.state.widget.hasOwnProperty(this.props.controlId)? (
              <Form.Label>No signals available</Form.Label>
            ) : (
              this.state.signals.map((signal, index) => (
                <Form.Check
                  style={{wordBreak: 'break-all'}}
                  type={'checkbox'}
                  label={signal.name}
                  id={signal.id}
                  key={signal.id}
                  checked={this.state.checkedSignals.find(id => id === signal.id) !== undefined}
                  onChange={(e) => this.handleSignalChange(e.target.checked, signal.id)}>
                </Form.Check>
                ))
              )
          }
        </Form.Group>
    );
  }
}

export default EditWidgetSignalsControl;
