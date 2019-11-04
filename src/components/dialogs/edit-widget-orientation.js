/**
 * File: edit-widget-orientation.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 10.04.2017
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
import { FormGroup, Col, Row, Radio, ControlLabel } from 'react-bootstrap';

import WidgetSlider from '../widgets/slider';

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
