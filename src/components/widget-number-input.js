/**
 * File: widget-number-input.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 29.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Form, FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';

class WidgetNumberInput extends Component {
  
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
        validationState: WidgetNumberInput.whichValidationStateIs('ok')
    };
  }

  validateInput(e) {
      if (e.target.value === '' || e.target.value.endsWith('.')) {
        this.setState({
            validationState: WidgetNumberInput.whichValidationStateIs('ok'),
            value: e.target.value });
      } else {
        var num = Number(e.target.value);
        if (Number.isNaN(num)) {
            this.setState({ validationState: WidgetNumberInput.whichValidationStateIs('error'),
                value: e.target.value });
        } else {
            this.setState({
                validationState: WidgetNumberInput.whichValidationStateIs('ok'),
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

export default WidgetNumberInput;