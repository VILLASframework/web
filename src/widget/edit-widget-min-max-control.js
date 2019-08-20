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

    const widget = {};
    widget[props.controlID + "UseMinMax"] = false;
    widget[props.controlId + "Min"] = 0;
    widget[props.controlId + "Max"] = 100;

    this.state = {
      widget
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ widget: nextProps.widget });
  }

  render() {
    return <FormGroup>
      <FormLabel>{this.props.label}</FormLabel>
      <FormCheck id={this.props.controlId + "UseMinMax"} checked={this.state.widget[this.props.controlId + "UseMinMax"] || ''} onChange={e => this.props.handleChange(e)}>Enable min-max</FormCheck>

      <Table>
        <tbody>
          <tr>
            <td>
              Min: <FormControl type="number" step="any" id={this.props.controlId + "Min"} disabled={!this.state.widget[this.props.controlId + "UseMinMax"]} placeholder="Minimum value" value={this.state.widget[this.props.controlId + 'Min']} onChange={e => this.props.handleChange(e)} />
            </td>
            <td>
              Max: <FormControl type="number" step="any" id={this.props.controlId + "Max"} disabled={!this.state.widget[this.props.controlId + "UseMinMax"]} placeholder="Maximum value" value={this.state.widget[this.props.controlId + 'Max']} onChange={e => this.props.handleChange(e)} />
            </td>
          </tr>
        </tbody>
      </Table>
    </FormGroup>;
  }
}

export default EditWidgetMinMaxControl;
