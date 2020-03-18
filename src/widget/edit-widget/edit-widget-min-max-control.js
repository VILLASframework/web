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
import { FormGroup, FormControl, FormLabel, FormCheck, Table } from 'react-bootstrap';

class EditWidgetMinMaxControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: props.widget
    }

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

    console.log("min max edit: ", isCustomProperty);

    return <FormGroup>
      <FormLabel>{this.props.label}</FormLabel>
      <FormCheck
        type={'checkbox'}
        id={this.props.controlId + "UseMinMax"}
        label= {"UseMinMax"}
        checked={isCustomProperty ? this.state.widget[parts[0]][parts[1]+"UseMinMax"]  ==='on' : this.state.widget[this.props.controlId + "UseMinMax"] === 'on'}
        onChange={e => this.props.handleChange(e)}>
      </FormCheck>

      <Table>
        <tbody>
          <tr>
            <td>
              Min:
              <FormControl
                type="number"
                step="any"
                id={this.props.controlId + "Min"}
                disabled={isCustomProperty ? !(this.state.widget[parts[0]][parts[1] + "UseMinMax"] === 'on'): !(this.state.widget[this.props.controlId + "UseMinMax"] === 'on')}
                placeholder="Minimum value"
                value={isCustomProperty ? this.state.widget[parts[0]][parts[1] + 'Min'] : this.state.widget[this.props.controlId + "Min"]}
                onChange={e => this.props.handleChange(e)} />
            </td>
            <td>
              Max:
              <FormControl
                type="number"
                step="any"
                id={this.props.controlId + "Max"}
                disabled={isCustomProperty ? !(this.state.widget[parts[0]][parts[1] + "UseMinMax"] === 'on'): !(this.state.widget[this.props.controlId + "UseMinMax"] === 'on')}
                placeholder="Maximum value"
                value={ isCustomProperty ? this.state.widget[parts[0]][parts[1] + 'Max'] : this.state.widget[this.props.controlId + "Max"]}
                onChange={e => this.props.handleChange(e)} />
            </td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>;
  }
}

export default EditWidgetMinMaxControl;
