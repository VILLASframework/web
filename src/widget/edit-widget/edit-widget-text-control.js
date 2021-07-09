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
import { Form } from 'react-bootstrap';

class EditWidgetTextControl extends Component {
  constructor(props) {
    super(props);

    let value = "";
    let parts = props.controlId.split('.');
    if (parts.length === 1) {
      // not a customProperty
      value=props.widget[props.controlId]
    } else if(parts.length === 2){
      // a custom property
      value=props.widget[parts[0]][parts[1]]
    } else {
      value="controlID contains too many dots"
    }

    this.state = {
      value: value
    };
  }

  static getDerivedStateFromProps(props, state){

    let value = "";
    let parts = props.controlId.split('.');
    if (parts.length === 1) {
      // not a customProperty
      value=props.widget[props.controlId]
    } else if(parts.length === 2){
      // a custom property
      value=props.widget[parts[0]][parts[1]]
    } else {
      value="controlID contains too many dots"
    }

    return {
      value: value
    }
  }

  render() {
    return (
        <Form.Group controlId={this.props.controlId} style={this.props.style}>
          <Form.Label>{this.props.label}</Form.Label>
          <Form.Control type="text" placeholder={this.props.placeholder} value={this.state.value} onChange={e => this.props.handleChange(e)} />
          <Form.Control.Feedback />
        </Form.Group>
    );
  }
}

export default EditWidgetTextControl;
