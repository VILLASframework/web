/**
 * File: widget-number-input.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 29.03.2017
 * Copyright: 2018, Institute for Automation of Complex Power Systems, EONERC
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
 ******************************************************************************/

import React, { Component } from 'react';
import { Form, FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';

class WidgetInput extends Component {

  static whichValidationStateIs( condition ) {
    switch(condition) {
        case 'ok': return null;
        case 'error': return 'error';
        default: return 'error';
    }
  }

  constructor(props) {
    super(props);

    this.state = {
        value: '',
        validationState: WidgetInput.whichValidationStateIs('ok')
    };
  }

  validateInput(e) {
      if (e.target.value === '' || e.target.value.endsWith('.')) {
        this.setState({
            validationState: WidgetInput.whichValidationStateIs('ok'),
            value: e.target.value });
      } else {
        var num = Number(e.target.value);
        if (Number.isNaN(num)) {
            this.setState({ validationState: WidgetInput.whichValidationStateIs('error'),
                value: e.target.value });
        } else {
            this.setState({
                validationState: WidgetInput.whichValidationStateIs('ok'),
                value: num });
        }
      }
  }

  render() {
    return (
      <div className="number-input-widget full">
          <Form componentClass="fieldset" horizontal>
              <FormGroup controlId="formValidationError3" validationState={ this.state.validationState} >
                  <Col componentClass={ControlLabel} xs={3}>
                    {this.props.widget.name}
                  </Col>
                  <Col xs={9}>
                    <FormControl type="text" disabled={ this.props.editing } onInput={ (e) => this.validateInput(e) } placeholder="Enter value" value={ this.state.value } />
                    <FormControl.Feedback />
                  </Col>
                </FormGroup>
            </Form>
      </div>
    );
  }
}

export default WidgetInput;
