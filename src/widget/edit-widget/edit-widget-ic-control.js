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

class EditWidgetICControl extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ics: [],
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      ics: props.ics
    };
  }

  handleICChange(e) {
    let value = e.target.value === "Select IC" ? (-1) : (e.target.value);
    this.props.handleChange({ target: { id: this.props.controlId, value: value } });
  }

  render() {

    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if(parts.length === 1){
      isCustomProperty = false;
    }

    let icOptions = [];
    if (this.state.ics !== null && this.state.ics.length > 0){
      icOptions.push(
        <option key = {0} default>Select IC</option>
        )
      icOptions.push(this.state.ics.map((ic, index) => (
        <option key={index+1} value={ic.id}>{ic.name}</option>
      )))
    } else {
      icOptions = <option style={{ display: 'none' }}>No ics found</option>
    }

    return <div>
      <Form.Group controlId="ic">
        <Form.Label>IC</Form.Label>
        <Form.Control
          as="select"
          value={isCustomProperty ? this.props.widget[parts[0]][parts[1]] : this.props.widget[this.props.controlId]}
          onChange={(e) => this.handleICChange(e)}>{icOptions} </Form.Control>
      </Form.Group>
    </div>;
  }
}

export default EditWidgetICControl;
