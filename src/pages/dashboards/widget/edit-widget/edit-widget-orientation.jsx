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
import { Col, Row, Form } from 'react-bootstrap';
import WidgetSlider from '../widgets/slider';

class EditWidgetOrientation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        customProperties:{}
      }
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget
    };
  }

  handleOrientationChange(orientation) {
    this.props.handleChange({ target: { id: 'customProperties.orientation', value: orientation } });
    this.handleNewDimensions(this.state.widget.width,this.state.widget.height,this.state.widget.minWidth,this.state.widget.minHeight);
  }

  handleNewDimensions(width,height,minWidth,minHeight){
    this.props.handleChange({ target: { id: 'height', value: width } });
    this.props.handleChange({ target: { id: 'width', value: height } });
    this.props.handleChange({ target: { id: 'minHeight', value: minWidth } });
    this.props.handleChange({ target: { id: 'minWidth', value: minHeight } });
  }

  render() {
    // The <Row> tag shouldn't be necessary, but it gives height to the row while combining horizontal and vertical forms
    return (
        <Form.Group controlId="orientation" style={this.props.style}>
          <Row>
            <Col className={Form.Label} sm={3}>
              Orientation
            </Col>
            <Col sm={10}>
              {
                Object.keys(WidgetSlider.OrientationTypes).map( (type) => {
                  let value = WidgetSlider.OrientationTypes[type].value;
                  let name = WidgetSlider.OrientationTypes[type].name;

                  return <Form.Check
                      label={name}
                      key={value}
                      id={value}
                      type='radio'
                      title='orientation'
                      checked={ value === this.state.widget.customProperties.orientation }
                      onChange={(e) => this.handleOrientationChange(value)}
                    />
                })
              }
            </Col>
          </Row>
        </Form.Group>
    );
  }
}

export default EditWidgetOrientation;
