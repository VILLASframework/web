/**
 * File: widget-plot-table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
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
import { LineChart } from 'rd3';

import { ButtonGroup, Button } from 'react-bootstrap';

class WidgetPlotTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: { w: 0, h: 0 },
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

    // plot size
    this.setState({ size: { w: this.props.widget.width - 100, h: this.props.widget.height - 20 }});

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
    console.log("Signal: " + this.state.signal);
    return (
      <div className="plot-table-widget" style={{ width: '100%', height: '100%' }} ref="wrapper">
        <h4>{this.props.widget.name}</h4>

        <div className="content">
          <div className="widget-table">
            <ButtonGroup vertical>
              { this.state.rows.map( (row, index) => (
                  <Button key={index} active={ index === this.state.signal } disabled={ this.props.editing } onClick={() => this.setState({ signal: Number(index) }) } > { row.name } </Button>
                ))
              }
            </ButtonGroup>
          </div>

          <div className="widget-plot">
            {this.state.sequence &&
              <LineChart
                width={ this.state.size.w || 100 }
                height={ this.state.size.h || 100 }
                data={this.state.values}
                gridHorizontal={true}
                xAccessor={(d) => { if (d != null) { return new Date(d.x); } }}
                hoverAnimation={false}
                circleRadius={0}
                domain={{ x: [this.state.firstTimestamp, this.state.latestTimestamp] }}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default WidgetPlotTable;
