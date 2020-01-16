/**
 * File: edit-widget-color-zones-control.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.08.2017
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
import { FormGroup, FormLabel, Button } from 'react-bootstrap';


import Icon from '../common/icon';
import Table from '../common/table';
import TableColumn from '../common/table-column';

class EditWidgetColorZonesControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        customProperties:{
        zones: []
        }
      },
      selectedZones: []
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget
    };
  }

  addZone = () => {
    // add row
    const widget = this.state.widget;
    widget.customProperties.zones.push({ strokeStyle: 'ffffff', min: 0, max: 100 });

    this.setState({ widget });

    this.sendEvent(widget);
  }

  removeZones = () => {
    // remove zones
    const widget = this.state.widget;

    this.state.selectedZones.forEach(row => {
      widget.customProperties.zones.splice(row, 1);
    });

    this.setState({ selectedZones: [], widget });

    this.sendEvent(widget);
  }

  changeCell = (event, row, column) => {
    // change row
    const widget = this.state.widget;

    if (column === 1) {
      widget.customProperties.zones[row].strokeStyle = event.target.value;
    } else if (column === 2) {
      widget.customProperties.zones[row].min = event.target.value;
    } else if (column === 3) {
      widget.customProperties.zones[row].max = event.target.value;
    }

    this.setState({ widget });

    this.sendEvent(widget);
  }

  sendEvent(widget) {
    // create event
    const event = {
      target: {
        id: 'zones',
        value: widget.customProperties.zones
      }
    };

    this.props.handleChange(event);
  }

  checkedCell = (row, event) => {
    // update selected rows
    const selectedZones = this.state.selectedZones;

    if (event.target.checked) {
      if (selectedZones.indexOf(row) === -1) {
        selectedZones.push(row);
      }
    } else {
      let index = selectedZones.indexOf(row);
      if (row > -1) {
        selectedZones.splice(index, 1);
      }
    }

    this.setState({ selectedZones });
  }

  render() {
    return <FormGroup>
      <FormLabel>Color zones</FormLabel>

      <Table data={this.state.widget.customProperties.zones}>
        <TableColumn width="20" checkbox onChecked={this.checkedCell} />
        <TableColumn title="Color" dataKey="strokeStyle" inlineEditable onInlineChange={this.changeCell}  />
        <TableColumn title="Minimum" dataKey="min" inlineEditable onInlineChange={this.changeCell} />
        <TableColumn title="Maximum" dataKey="max" inlineEditable onInlineChange={this.changeCell} />
      </Table>

      <Button onClick={this.addZone} disabled={!this.props.widget.customProperties.colorZones}><Icon icon="plus" /> Add</Button>
      <Button onClick={this.removeZones} disabled={!this.props.widget.customProperties.colorZones}><Icon icon="minus" /> Remove</Button>
    </FormGroup>;
  }
}

export default EditWidgetColorZonesControl;
