/**
 * File: table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 14.03.2017
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

import React, { Component } from 'react';
import { format } from 'd3';

import Table from '../../common/table';
import TableColumn from '../../common/table-column';

class WidgetTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      sequence: null,
      showUnit: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.simulationModel == null) {
      this.setState({ rows: [], sequence: null });
      return;
    }

    const simulator = nextProps.simulationModel.simulator;

    // check data
    if (nextProps.data == null
      || nextProps.data[simulator] == null
      || nextProps.data[simulator].output == null
      || nextProps.data[simulator].output.values.length === 0
      || nextProps.data[simulator].output.values[0].length === 0) {

      // clear values
      this.setState({ rows: [], sequence: null, showUnit: false });
      return;
    }

    // check if new data, otherwise skip
    /*if (this.state.sequence >= nextProps.data[simulator.node][simulator.simulator].sequence) {
      return;
    }*/

    // get rows
    const rows = [];

    nextProps.data[simulator].output.values.forEach((signal, index) => {
      if (index < nextProps.simulationModel.outputMapping.length) {
        rows.push({
          name: nextProps.simulationModel.outputMapping[index].name,
          unit: nextProps.simulationModel.outputMapping[index].type,
          value: signal[signal.length - 1].y
        });
      }
    });

    this.setState({ showUnit: nextProps.showUnit, rows: rows, sequence: nextProps.data[simulator].output.sequence });
  }

  render() {
    var columns = [
      <TableColumn key={1} title="Signal" dataKey="name" width={120} />,
      <TableColumn key={2} title="Value" dataKey="value" modifier={format('.4s')} />
    ];

    if (this.props.widget.customProperties.showUnit)
      columns.push(<TableColumn key={3} title="Unit" dataKey="unit" />)

    return (
      <div className="table-widget">
        <Table data={this.state.rows}>
          { columns }
        </Table>
      </div>
    );
  }
}

export default WidgetTable;
