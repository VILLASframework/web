/**
 * File: edit-widget-text-control.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 21.04.2017
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
import { FormGroup, FormLabel } from 'react-bootstrap';
import ParametersEditor from '../common/parameters-editor';

class EditWidgetParametersControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {}
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget
    };
  }

  handleChange(value) {
    this.props.handleChange({
      target: {
        id: this.props.controlId,
        value: value
      }
    });
  }

  render() {
    return (
        <FormGroup controlId={this.props.controlId} validationState={this.props.validate ? this.props.validate(this.props.controlId) : null}>
          <FormLabel>{this.props.label}</FormLabel>
          <ParametersEditor content={this.state.widget[this.props.controlId] || {}} onChange={(v)=> this.handleChange(v)} />
        </FormGroup>
    );
  }
}

export default EditWidgetParametersControl;
