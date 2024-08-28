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
import { Form, Table } from 'react-bootstrap';

class EditWidgetMinMaxControl extends React.Component {
  constructor(props) {
    super(props);


    let parts = props.controlId.split('.');
    let isCustomProperty = true;
    if (parts.length === 1){
      isCustomProperty = false;
    }

    let useMinMax;
    let minValue = 0;
    let maxValue = 0;
    if (isCustomProperty){
      useMinMax = props.widget[parts[0]][parts[1]+"UseMinMax"];
      if (useMinMax) {
        minValue = props.widget[parts[0]][parts[1] + 'Min'];
        maxValue = props.widget[parts[0]][parts[1] + 'Max'];
      }

    } else {
      useMinMax = props.widget[props.controlId + "UseMinMax"]
      if (useMinMax){
        minValue = props.widget[props.controlId + "Min"]
        maxValue = props.widget[props.controlId + "Max"]
      }
    }

    this.state = {
      useMinMax,
      minValue,
      maxValue,
    }

  }

  handleCheckboxChange(e){

    // toggle boolean variable
    let status = this.state.useMinMax;
    this.setState({useMinMax: !status});
    this.props.handleChange({target: { id: this.props.controlId + "UseMinMax", value: !status} })
  }

  handleMinChange(e){
    this.setState({minValue: e.target.value});
    this.props.handleChange({target: { id: this.props.controlId + "Min", value: Number(e.target.value)} })
  }

  handleMaxChange(e){
    this.setState({maxValue: e.target.value});
    this.props.handleChange({target: { id: this.props.controlId + "Max", value: Number(e.target.value)} })
  }

  render() {

    return <Form.Group style={this.props.style}>
      <Form.Label>{this.props.label}</Form.Label>
      <Form.Check
        label= {"UseMinMax"}
        defaultChecked={this.state.useMinMax}
        onChange={e => this.handleCheckboxChange(e)}>
      </Form.Check>

      <Table>
        <tbody>
          <tr>
            <td>
              Min:
              <Form.Control
                type="number"
                step="any"
                disabled={!this.state.useMinMax}
                placeholder="Minimum value"
                value={this.state.minValue}
                onChange={e => this.handleMinChange(e)} />
            </td>
            <td>
              Max:
              <Form.Control
                type="number"
                step="any"
                disabled={!this.state.useMinMax}
                placeholder="Maximum value"
                value={ this.state.maxValue}
                onChange={e => this.handleMaxChange(e)} />
            </td>
          </tr>
        </tbody>
      </Table>
    </Form.Group>;
  }
}

export default EditWidgetMinMaxControl;
