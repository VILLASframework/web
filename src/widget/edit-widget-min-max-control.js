/**
 * File: edit-widget-min-max-control.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 30.08.2017
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
 ******************************************************************************/

import React from 'react';
import { FormGroup, FormControl, FormLabel, FormCheck, Table } from 'react-bootstrap';

class EditWidgetMinMaxControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        customProperties:{

        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ widget: nextProps.widget });
  }

  render() {
    console.log("in minmax control, widget: ");
    console.log(this.state.widget);
    return <FormGroup>
      <FormLabel>{this.props.label}</FormLabel>
      <FormCheck id={this.props.controlId + "UseMinMax"} label= {"UseMinMax"} checked={this.state.widget.customProperties[this.props.controlId + "UseMinMax"] || ''} onChange={e => this.props.handleChange(e)}></FormCheck>

      <Table>
        <tbody>
          <tr>
            <td>
              Min: <FormControl type="number" step="any" id={this.props.controlId + "Min"} disabled={!this.state.widget.customProperties[this.props.controlId + "UseMinMax"]} placeholder="Minimum value" value={this.state.widget.customProperties[this.props.controlId + 'Min']} onChange={e => this.props.handleChange(e)} />
            </td>
            <td>
              Max: <FormControl type="number" step="any" id={this.props.controlId + "Max"} disabled={!this.state.widget.customProperties[this.props.controlId + "UseMinMax"]} placeholder="Maximum value" value={this.state.widget.customProperties[this.props.controlId + 'Max']} onChange={e => this.props.handleChange(e)} />
            </td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>;
  }
}

export default EditWidgetMinMaxControl;
