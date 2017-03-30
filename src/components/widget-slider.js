/**
 * File: widget-slider.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 30.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';

class WidgetSlider extends Component {

  constructor(props) {
    super(props);

    this.state = {
        value: 50
    };
  }

  valueChanged(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <div className="slider-widget full">
          <Form componentClass="fieldset" horizontal>
              <FormGroup validationState={ this.state.validationState} >
                  <Col componentClass={ControlLabel} xs={3}>
                    {this.props.widget.name}
                  </Col>
                  <Col xs={8}>
                    <input type="range"  min="0" max="100" disabled={ this.props.editing } onChange={ (e) => this.valueChanged(e) } defaultValue={ this.state.value }/>
                  </Col>
                  <Col xs={1}>
                    <span>{ this.state.value }</span>
                  </Col>
                </FormGroup>
            </Form>
      </div>
    );
  }
}

export default WidgetSlider;