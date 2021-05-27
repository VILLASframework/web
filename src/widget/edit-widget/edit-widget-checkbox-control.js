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
 ******************************************************************************/

import React from 'react';
import { Form } from 'react-bootstrap';

class EditWidgetCheckboxControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    }
  }

  static getDerivedStateFromProps(props, state) {
    let parts = props.controlId.split('.');
    let isChecked;

    if (parts.length ===1){
      isChecked = props.widget[props.controlId]
    } else {
      isChecked = props.widget[parts[0]][parts[1]]
    }

    return {
      isChecked
    };
  }

  handleCheckboxChange(e){
    this.props.handleChange({target: { id: this.props.controlId, value: !this.state.isChecked} })
  }

  render() {
    return <Form.Group>
      <Form.Check
        type={"checkbox"}
        id={this.props.controlId}
        label={this.props.text}
        defaultChecked={this.state.isChecked}
        onChange={e => this.handleCheckboxChange(e)}
      />
    </Form.Group>;
  }
}

export default EditWidgetCheckboxControl;
