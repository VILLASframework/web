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
 ******************************************************************************/

import React, { Component } from 'react';
import { Form, Col, InputGroup } from 'react-bootstrap';
import AppDispatcher from '../../common/app-dispatcher';

class WidgetInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
        value: '',
        unit: ''
    };
  }

  componentDidMount() {
    let widget = this.props.widget
    widget.customProperties.simStartedSendValue = false
    AppDispatcher.dispatch({
      type: 'widgets/start-edit',
      token: this.props.token,
      data: widget
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // a simulaton was started, make an update
    if (this.props.widget.customProperties.simStartedSendValue) {
      let widget = this.props.widget
      widget.customProperties.simStartedSendValue = false
      AppDispatcher.dispatch({
        type: 'widgets/start-edit',
        token: this.props.token,
        data: widget
      });

      // send value, don't change widget
      this.props.onInputChanged(Number(this.state.value), '', '', false);
    }
  }

  static getDerivedStateFromProps(props, state){

    let value = ''
    let unit = ''

    if(props.widget.customProperties.hasOwnProperty('value') && props.widget.customProperties.value !== state.value){
      // set value to customProperties.value if this property exists and the value is different from current state
      value = Number(props.widget.customProperties.value);
    } else if (props.widget.customProperties.hasOwnProperty('default_value') && state.value === ''){
      // if customProperties.default_value exists and value has been assigned yet, set the value to the default_value
      value = Number(props.widget.customProperties.default_value)
    }

    if (props.widget.signalIDs.length > 0) {
      // Update unit (assuming there is exactly one signal for this widget)
      let signalID = props.widget.signalIDs[0];
      let signal = props.signals.find(sig => sig.id === signalID);
      if (signal !== undefined) {
        unit = signal.unit;
      }
    }

    if (unit !== '' && value !== ''){
      // unit and value have changed
      return {unit: unit, value: value};
    } else if (unit !== ''){
      // only unit has changed
      return {unit: unit}
    } else if (value !== ''){
      // only value has changed
      return {value: value}
    } else{
      // nothing has changed
      return null
    }
  }

  valueIsChanging(newValue) {
    this.setState({ value: Number(newValue) });
    this.props.widget.customProperties.value = Number(newValue);
  }

  valueChanged(newValue) {
    if (this.props.onInputChanged) {
      this.props.onInputChanged(Number(newValue), 'value', Number(newValue), true);
    }
  }

  handleKeyPress(e) {
    if(e.charCode === 13) {
      this.valueChanged(this.state.value)
    }
  }

  render() {
    return (
      <div className="number-input-widget full">
          <Form componentclass="fieldset" horizontal="true">
              <Form.Group>
                  <Col as={Form.Label}>
                    {this.props.widget.name}
                    {this.props.widget.customProperties.showUnit? (
                      " [" + this.state.unit + "]"

                    ):(
                      ""
                    )}

                  </Col>
                  <Col>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        step="any"
                        disabled={ this.props.editing }
                        onKeyPress={ (e) => this.handleKeyPress(e) }
                        onBlur={ (e) => this.valueChanged(this.state.value) }
                        onChange={ (e) => this.valueIsChanging(e.target.value) }
                        placeholder="Enter value"
                        value={ this.state.value }
                      />

                    </InputGroup>
                  </Col>
                </Form.Group>
            </Form>
      </div>
    );
  }
}

export default WidgetInput;
