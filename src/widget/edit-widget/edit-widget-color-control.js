/**
 * File: edit-widget-color-control.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 24.04.2017
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
import { FormGroup, Col, Row, FormCheck, FormLabel } from 'react-bootstrap';
import classNames from 'classnames';
import { scaleOrdinal } from 'd3-scale';
import {schemeCategory10} from 'd3-scale-chromatic'
// schemeCategory20 no longer available in d3

class EditWidgetColorControl extends Component {

  static get ColorPalette() {
    let colorCount = 0;
    const colors = [];
    const colorScale = scaleOrdinal(schemeCategory10);
    while (colorCount < 10) { colors.push(colorScale(colorCount)); colorCount++; }
    colors.unshift('#000', '#FFF'); // include black and white

    return colors;
  }

  constructor(props) {
    super(props);

    this.state = {
      widget: {
        
      }
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget
    };
  }

  render() {
    return (
      <FormGroup bsclass="color-control">
        <Row>
          <Col className={FormLabel} style={{whiteSpace: 'nowrap' }} sm={3}>
            { this.props.label }
          </Col>
          <Col sm={10} bsclass='colors-column'>
          {
            EditWidgetColorControl.ColorPalette.map( (color, idx ) => {
                let colorStyle = {
                  background: color,
                  borderColor: color
                };

                let checkedClass = classNames({
                  'checked': idx === this.state.widget[this.props.controlId] || this.state.widget.customProperties[this.props.controlId]
                });

                return (<FormCheck type='radio' key={idx} name={this.props.controlId} style={colorStyle} className={checkedClass} value={idx} inline onChange={(e) => this.props.handleChange({target: { id: this.props.controlId, value: idx}})} />)
              }
            )
          }
          </Col>
        </Row>
      </FormGroup> )
  }
}

export default EditWidgetColorControl;
