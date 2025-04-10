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

class EditWidgetSamplesControl extends Component {
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

    if (this.props.widget.customProperties.mode === "last samples" && typeof this.props.nbrId !== "undefined") {

      let parts = this.props.nbrId.split('.');
      let isCustomProperty = true;
      if (parts.length === 1) {
        isCustomProperty = false;
      }

      return (
        <Form.Group controlId={this.props.nbrId}>
          <Form.Label>Number of Samples</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="300"
            placeholder="Enter number of samples"
            value={isCustomProperty ? this.state.widget[parts[0]][parts[1]] : this.state.widget[this.props.controlId]}
            onChange={(e) => this.props.handleChange(e)}
          />
          <Form.Text>Number of displayed samples</Form.Text>
        </Form.Group>
      );
    }
    else {
      let parts = this.props.timeId.split('.');
      let isCustomProperty = true;
      if (parts.length === 1) {
        isCustomProperty = false;
      }

      return (
        <Form.Group controlId={this.props.timeId}>
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="300"
            placeholder="Enter time"
            value={isCustomProperty ? this.state.widget[parts[0]][parts[1]] : this.state.widget[this.props.controlId]}
            onChange={(e) => this.props.handleChange(e)}
          />
          <Form.Text>Time in seconds</Form.Text>
        </Form.Group>
      );
    }
  }
}

export default EditWidgetSamplesControl;
