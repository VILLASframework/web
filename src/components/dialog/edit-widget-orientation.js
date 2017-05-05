/**
 * File: edit-widget-orientation.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 10.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, Col, Row, Radio, ControlLabel } from 'react-bootstrap';

import WidgetSlider from '../widget-slider';

class EditWidgetOrientation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {}
    };
  }

  componentWillReceiveProps(nextProps) {
      // Update state's widget with props
    this.setState({ widget: nextProps.widget });
  }

  handleOrientationChange(orientation) {
    this.props.handleChange({ target: { id: 'orientation', value: orientation } });
  }

  render() {

    // The <Row> tag shouldn't be necessary, but it gives height to the row while combining horizontal and vertical forms
    return (
        <FormGroup controlId="orientation">
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Orientation
            </Col>
            <Col sm={10}>
              { 
                Object.keys(WidgetSlider.OrientationTypes).map( (type) => {
                  let value = WidgetSlider.OrientationTypes[type].value;
                  let name = WidgetSlider.OrientationTypes[type].name;
                  
                  return (
                    <Radio inline key={value} name='orientation' checked={ value === this.state.widget.orientation } onChange={(e) => this.handleOrientationChange(value)}>
                      { name }
                    </Radio>)
                })
              }
            </Col>
          </Row>
        </FormGroup>
    );
  }
}

export default EditWidgetOrientation;