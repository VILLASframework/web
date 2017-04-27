/**
 * File: widget-plot.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 08.03.2017
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

class WidgetPlot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: [],
      firstTimestamp: 0,
      latestTimestamp: 0,
      sequence: null
    };
  }

  componentWillReceiveProps(nextProps) {
    // check data
    const simulator = nextProps.widget.simulator;

    if (nextProps.simulation == null || nextProps.data == null || nextProps.data[simulator] == null || nextProps.data[simulator].length === 0 || nextProps.data[simulator].values[0].length === 0) {
      // clear values
      this.setState({ values: [], sequence: null });
      return;
    }

    // check if new data, otherwise skip
    if (this.state.sequence >= nextProps.data[simulator].sequence) {
      return;
    }

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
    var values = [];

    nextProps.widget.signals.forEach((signal) => {
      values.push({
        values: nextProps.data[simulator].values[signal].slice(firstIndex, nextProps.data[simulator].values[signal].length - 1)
      });
    });

    this.setState({ values: values, firstTimestamp: firstTimestamp, latestTimestamp: latestTimestamp, sequence: nextProps.data[simulator].sequence });
  }

  render() {
    if (this.state.sequence == null) {
      return (<div>Empty</div>);
    }

    return (
      <div style={{ width: '100%', height: '100%' }} ref="wrapper">
        <LineChart
          width={this.props.widget.width}
          height={this.props.widget.height - 20}
          data={this.state.values}
          title={this.props.widget.name}
          gridHorizontal={true}
          xAccessor={(d) => { if (d != null) { return new Date(d.x); } }}
          hoverAnimation={false}
          circleRadius={0}
          domain={{ x: [this.state.firstTimestamp, this.state.latestTimestamp] }}
        />
      </div>
    );
  }
}

export default WidgetPlot;
