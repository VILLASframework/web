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

class EditWidgetRotationControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        customProperties:{}
      }
     };
  }

  static getDerivedStateFromProps(props, state){
    return{
      widget: props.widget
     };
  }

    handleRotationChange(e) {
        let rotation = parseInt(e.target.value, 10);
        let prevRotation = Math.abs(parseInt(this.props.widget.customProperties.rotation, 10));

        this.props.handleChange({ target: { id: 'customProperties.rotation', value: rotation } });

        let width = parseInt(this.props.widget.width, 10);
        let height = parseInt(this.props.widget.height, 10);
        let x = parseInt(this.props.widget.x, 10);
        let y = parseInt(this.props.widget.y, 10);

        rotation = Math.abs(rotation);

        if (rotation === 0 || (rotation % 180) === 0) {
            width = width > height ? width : height;
            let midHeight = y + height / 2;
            height = this.state.widget.customProperties.border_width + 24;
            y = midHeight - parseInt(height, 10) / 2

            this.handleNewRotation(false, false, true, width, height, x, Math.round(y));
        }
        else if (rotation % 90 === 0 && (rotation / 90) % 2 === 1) {
            height = height > width ? height : width;
            let midWidth = x + width / 2;
            width = this.state.widget.customProperties.border_width + 24;
            x = midWidth - parseInt(width, 10) / 2

            this.handleNewRotation(false, true, false, width, height, Math.round(x), y);
        }
        else {
            if (prevRotation === 0 || (prevRotation % 180) === 0) 
            {
                let midHeight = y + height / 2;
                y = midHeight - parseInt(width, 10) / 2
            }
            else if (prevRotation % 90 === 0 && (prevRotation / 90) % 2 === 1) 
            {
                let midWidth = x + width / 2;
                x = midWidth - parseInt(height, 10) / 2
            }

            width = width > height ? width : height;
            height = width;
            this.handleNewRotation(true, false, false, width, height, Math.round(x), Math.round(y));
        }
    }

  handleNewRotation(lockAspect,resizeLeftRightLock,resizeTopBottomLock, width, height, x, y){
    this.props.handleChange({ target: { id: 'customProperties.lockAspect', value: lockAspect } });
    this.props.handleChange({ target: { id: 'customProperties.resizeLeftRightLock', value: resizeLeftRightLock } });
    this.props.handleChange({ target: { id: 'customProperties.resizeTopBottomLock', value: resizeTopBottomLock } });
    this.props.handleChange({ target: { id: 'width', value: width } });
    this.props.handleChange({ target: { id: 'height', value: height } });
    this.props.handleChange({ target: { id: 'x', value: x } });
    this.props.handleChange({ target: { id: 'y', value: y } });
  }


  render() {
    let step = 1;

    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if (parts.length === 1){
      isCustomProperty = false;
    }

    return (
        <Form.Group controlId={this.props.controlId}>
          <Form.Label>{this.props.label}</Form.Label>
          <Form.Control
            type="number"
            step={step}
            value={isCustomProperty ? this.state.widget[parts[0]][parts[1]] : this.state.widget[this.props.controlId]}
            onChange={e => this.handleRotationChange(e)} />
        </Form.Group>
    );
  }
}

export default EditWidgetRotationControl;