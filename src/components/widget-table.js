/**
 * File: widget-table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 14.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';

import Table from './table';
import TableColumn from './table-column';

class WidgetTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      sequence: null
    };
  }

  componentWillReceiveProps(nextProps) {
    // check data
    const simulator = nextProps.widget.simulator;

    if (nextProps.simulation == null || nextProps.data == null || nextProps.data[simulator] == null || nextProps.data[simulator].length === 0 || nextProps.data[simulator].values[0].length === 0) {
      // clear values
      this.setState({ rows: [], sequence: null });
      return;
    }

    // check if new data, otherwise skip
    if (this.state.sequence >= nextProps.data[simulator].sequence) {
      return;
    }

    // get simulation model
    const simulationModel = nextProps.simulation.models.find((model) => {
      return (model.simulator === simulator);
    });

    // get rows
    var rows = [];

    nextProps.data[simulator].values.forEach((signal, index) => {
      rows.push({
        name: simulationModel.mapping[index].name,
        value: signal[signal.length - 1].y.toFixed(3)
      })
    });

    this.setState({ rows: rows, sequence: nextProps.data[simulator].sequence });
  }

  render() {
    return (
      <div className="table-widget">
        <h4>{this.props.widget.name}</h4>

        <Table data={this.state.rows}>
          <TableColumn title="Signal" dataKey="name" width={120} />
          <TableColumn title="Value" dataKey="value" />
        </Table>
      </div>
    );
  }
}

export default WidgetTable;
