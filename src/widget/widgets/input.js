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
import { Form, FormGroup, Col, FormLabel, FormControl, InputGroup } from 'react-bootstrap';

class WidgetInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
        value: '',
        unit: ''
    };
  }

  static getDerivedStateFromProps(props, state){

    if(props.widget.signalIDs.length === 0){
      return null;
    }

    let returnState = {};

    // Update value
    if (props.widget.customProperties.default_value && this.state.value === undefined) {
      returnState["value"] = props.widget.customProperties.default_value;
    }

    // Update unit (assuming there is exactly one signal for this widget)
    let signalID = props.widget.signalIDs[0];
    let signal = props.signals.find(sig => sig.id === signalID);
    if(signal !== undefined){
      returnState["unit"] = signal.unit;
    }

    if (returnState !== {}){
      return returnState;
    }
    else{
      return null;
    }
  }

  valueIsChanging(newValue) {
    this.setState({ value: newValue });
  }

  valueChanged(newValue) {
    if (this.props.onInputChanged) {
      this.props.onInputChanged(newValue);
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
          <Form componentClass="fieldset" horizontal>
              <FormGroup>
                  <Col as={FormLabel} xs={3}>
                    {this.props.widget.name}
                  </Col>
                  <Col xs={9}>
                    <InputGroup>
                      <FormControl type="number" step="any" disabled={ this.props.editing } onKeyPress={ (e) => this.handleKeyPress(e) } onBlur={ (e) => this.valueChanged(this.state.value) } onChange={ (e) => this.valueIsChanging(e.target.value) } placeholder="Enter value" value={ this.state.value } />
                      <InputGroup.Addon>{this.state.unit}</InputGroup.Addon>
                    </InputGroup>
                  </Col>
                </FormGroup>
            </Form>
      </div>
    );
  }
}

export default WidgetInput;
