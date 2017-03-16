/**
 * File: widget-plot-table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { LineChart } from 'rd3';
import { Col } from 'react-bootstrap';

import Table from './table';
import TableColumn from './table-column';

class WidgetPlotTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signal: 0,
      firstTimestamp: 0,
      latestTimestamp: 0,
      sequence: null,
      rows: [],
      values: []
    };
  }

  componentWillReceiveProps(nextProps) {
    // check data
    const simulator = nextProps.widget.simulator;

    if (nextProps.simulation == null || nextProps.data == null || nextProps.data[simulator] == null || nextProps.data[simulator].length === 0 || nextProps.data[simulator].values[0].length === 0) {
      // clear values
      this.setState({ values: [], sequence: null, rows: [] });
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

    simulationModel.mapping.forEach((signal) => {
      rows.push({ name: signal.name })
    });

    // get timestamps
    var latestTimestamp = nextProps.data[simulator].values[0][nextProps.data[simulator].values[0].length - 1].x;
    var firstTimestamp = latestTimestamp - nextProps.widget.time * 1000;
    var firstIndex;

    if (nextProps.data[simulator].values[0][0].x < firstTimestamp) {
      // find element index representing firstTimestamp
      firstIndex = nextProps.data[simulator].values[0].findIndex((value) => {
        return value.x >= firstTimestamp;
      });
    } else {
      firstIndex = 0;
      firstTimestamp = nextProps.data[simulator].values[0][0].x;
      latestTimestamp = firstTimestamp + nextProps.widget.time * 1000;
    }

    // copy all values for each signal in time region
    var values = [{
      values: nextProps.data[simulator].values[this.state.signal].slice(firstIndex, nextProps.data[simulator].values[this.state.signal].length - 1)
    }];

    this.setState({ values: values, firstTimestamp: firstTimestamp, latestTimestamp: latestTimestamp, sequence: nextProps.data[simulator].sequence, rows: rows });
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }} ref="wrapper">
        <h4>{this.props.widget.name}</h4>

        <Col xs={3}>
          <Table data={this.state.rows}>
            <TableColumn title="Signal" dataKey="name" clickable onClick={(index) => this.setState({ signal: index }) } />
          </Table>
        </Col>

        <Col xs={4}>
          {this.state.sequence &&
            <LineChart
              width={400}
              height={this.props.widget.height - 20}
              data={this.state.values}
              gridHorizontal={true}
              xAccessor={(d) => { if (d != null) { return new Date(d.x); } }}
              hoverAnimation={false}
              circleRadius={0}
              domain={{ x: [this.state.firstTimestamp, this.state.latestTimestamp] }}
            />
          }
        </Col>
      </div>
    );
  }
}

export default WidgetPlotTable;
