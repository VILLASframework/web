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
import { FormGroup, FormControl, FormLabel, FormText } from 'react-bootstrap';

class EditWidgetTimeControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
      }
    };
  }

  static getDerivedStateFromProps(props, state){
    return{
      widget: props.widget
    };
  }

  render() {

    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if (parts.length === 1){
      isCustomProperty = false;
    }

    return (
      <FormGroup controlId= {this.props.controlId}>
        <FormLabel>Time</FormLabel>
        <FormControl
          type="number"
          min="1"
          max="300"
          placeholder="Enter time"
          value={isCustomProperty ? this.state.widget[parts[0]][parts[1]] : this.state.widget[this.props.controlId]}
          onChange={(e) => this.props.handleChange(e)}
        />
        <FormText>Time in seconds</FormText>
      </FormGroup>
    );
  }
}

export default EditWidgetTimeControl;
