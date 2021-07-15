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

class EditWidgetICSelect extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ics: [],
      checkedICs: []
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      ics: props.ics
    };
  }

  handleICChange(checked, icID) {
    console.log(checked)
    console.log(icID)

    //let value = e.target.value === "Select IC" ? (-1) : (e.target.value);
    //this.props.handleChange({ target: { id: this.props.controlId, value: value } });
  }

  render() {
    return <div style={this.props.style}>
      <Form.Group controlId="ic">
        <Form.Label>Visible ICs</Form.Label>
        {
          this.state.ics.map(ic => (
            <Form.Check
              style={{wordBreak: 'break-all'}}
              type={'checkbox'}
              label={ic.name}
              id={ic.id}
              key={ic.id}
              checked={this.state.checkedICs.find(id => id === ic.id) !== undefined}
              onChange={(e) => this.handleICChange(e.target.checked, ic.id)}
              >
            </Form.Check>
          ))
        }
      </Form.Group>
    </div>;
  }
}

export default EditWidgetICSelect;
