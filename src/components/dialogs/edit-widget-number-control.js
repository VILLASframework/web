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
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class EditWidgetNumberControl extends Component {
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

  render() {
    return (
        <FormGroup controlId={this.props.controlId}>
          <ControlLabel>{this.props.label}</ControlLabel>
          <FormControl type="number" step="any" defaultValue={this.props.defaultValue} value={this.state.widget[this.props.controlId] || 0} onChange={e => this.props.handleChange(e)} />
        </FormGroup>
    );
  }
}

export default EditWidgetNumberControl;
