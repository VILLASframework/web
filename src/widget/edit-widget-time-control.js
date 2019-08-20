/**
 * File: edit-widget-time-control.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 13.04.2017
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
import { FormGroup, FormControl, FormLabel, FormText } from 'react-bootstrap';

class EditWidgetTimeControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        time: 0
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ widget: nextProps.widget });
  }

  render() {

    return (
      <FormGroup controlId="time">
        <FormLabel>Time</FormLabel>
        <FormControl type="number" min="1" max="300" placeholder="Enter time" value={this.state.widget.time} onChange={(e) => this.props.handleChange(e)} />
        <FormText>Time in seconds</FormText>
      </FormGroup>
    );
  }
}

export default EditWidgetTimeControl;
