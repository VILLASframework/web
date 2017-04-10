/**
 * File: plot.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 10.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { LineChart } from 'rd3';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';

class Plot extends Component {
  constructor(props) {
    super(props);
    
    this.chartWrapper = null;

    this.state = {
      size: { w: 0, h: 0 },
      firstTimestamp: 0,
      latestTimestamp: 0,
      sequence: null,
      values: []
    };
  }

  componentWillReceiveProps(nextProps) {
    let nextData = nextProps.simulatorData;

    // handle plot size
    const w = this.chartWrapper.offsetWidth - 20;
    const h = this.chartWrapper.offsetHeight - 20;
    const currentSize = this.state.size;
    if (w !== currentSize.w || h !== currentSize.h) {
        this.setState({size: { w, h } });
    }

    // Identify simulation reset
    if (nextData == null || nextData.length === 0 || nextData.values[0].length === 0) {
      // clear values
      this.setState({ values: [], sequence: null });
      return;
    }
    
    // check if new data, otherwise skip
    if (this.state.sequence >= nextData.sequence) {
      return;
    }

    this.updatePlotData(nextProps);

  }

  updatePlotData(nextProps) {
    let nextData = nextProps.simulatorData;

    // get timestamps
    var latestTimestamp = nextData.values[0][nextData.values[0].length - 1].x;
    var firstTimestamp = latestTimestamp - nextProps.time * 1000;
    var firstIndex;

    if (nextData.values[0][0].x < firstTimestamp) {
      // find element index representing firstTimestamp
      firstIndex = nextData.values[0].findIndex((value) => {
        return value.x >= firstTimestamp;
      });
    } else {
      firstIndex = 0;
      firstTimestamp = nextData.values[0][0].x;
      latestTimestamp = firstTimestamp + nextProps.time * 1000;
    }

    // copy all values for each signal in time region
    var values = [];
    nextProps.signals.forEach((signal_index, i, arr) => (
      // Include signal index, useful to relate them to the signal selection
      values.push(
        { 
          index: signal_index,
          values: nextData.values[signal_index].slice(firstIndex, nextData.values[signal_index].length - 1)})
    ));

    this.setState({ values: values, firstTimestamp: firstTimestamp, latestTimestamp: latestTimestamp, sequence: nextData.sequence });
  }

  render() {
    // Make tick count proportional to the plot width using a rough scale ratio
    var tickCount = Math.round(this.state.size.w / 80);

    return (
        <div className="chart-wrapper" ref={ (domNode) => this.chartWrapper = domNode }>
            {this.state.sequence &&
                <LineChart
                width={ this.state.size.w || 100 }
                height={ this.state.size.h || 100 }
                margins={{top: 10, right: 0, bottom: 20, left: 45 }}
                data={this.state.values }
                colors={ scaleOrdinal(schemeCategory10) }
                gridHorizontal={true}
                xAccessor={(d) => { if (d != null) { return new Date(d.x); } }}
                xAxisTickCount={ tickCount }
                hoverAnimation={false}
                circleRadius={0}
                domain={{ x: [this.state.firstTimestamp, this.state.latestTimestamp] }}
                />
            }
        </div>
    );
  }

}

export default Plot;