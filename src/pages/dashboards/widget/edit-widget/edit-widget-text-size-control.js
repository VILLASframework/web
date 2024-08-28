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

import React from 'react';
import { Form } from 'react-bootstrap';

class EditWidgetTextSizeControl extends React.Component {
  render() {
    const sizes = [11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 46, 52, 60, 72];

    return (
      <Form.Group controlId="customProperties.textSize" style={this.props.style}>
        <Form.Label>Text size</Form.Label>
        <Form.Control as="select" value={this.props.widget.customProperties.textSize} onChange={e => this.props.handleChange(e)}>
          {sizes.map((size, index) => (
            <option key={index} value={size}>{size}</option>
          ))}
        </Form.Control>
      </Form.Group>
    );
  }
}

export default EditWidgetTextSizeControl;
