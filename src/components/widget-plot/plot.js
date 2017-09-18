/**
 * File: plot.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 10.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React from 'react';
import { scaleLinear, scaleTime, scaleOrdinal, schemeCategory10 } from 'd3-scale';
import { extent } from 'd3-array';
import { line } from 'd3-shape';
import { axisBottom, axisLeft } from  'd3-axis';
import { select } from 'd3-selection';
import { timeFormat } from 'd3-time-format';

const leftMargin = 30;
const bottomMargin = 20;

class Plot extends React.Component {
  constructor(props) {
    super(props);

    // create dummy axes
    const xScale = scaleTime().domain([Date.now(), Date.now() + 5 * 1000]).range([leftMargin, props.width]);
    const yScale = scaleLinear().domain([0, 10]).range([props.height, bottomMargin]);

    const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(date => timeFormat("%M:%S")(date));
    const yAxis = axisLeft().scale(yScale).ticks(5);

    this.state = {
      data: null,
      xAxis,
      yAxis
    };
  }

  componentWillReceiveProps(nextProps) {
    // check if data is valid
    if (nextProps.data == null || nextProps.data.length === 0 || nextProps.data[0].length === 0) {
      // create empty plot axes
      const xScale = scaleTime().domain([Date.now(), Date.now() + 5 * 1000]).range([leftMargin, nextProps.width]);
      const yScale = scaleLinear().domain([0, 10]).range([nextProps.height, bottomMargin]);
  
      const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(date => timeFormat("%M:%S")(date));
      const yAxis = axisLeft().scale(yScale).ticks(5);

      this.setState({ data: null, xAxis, yAxis });
      return;
    }

    // only show data in requested time
    let data = nextProps.data;
    
    const firstTimestamp = data[0][data[0].length - 1].x - nextProps.time * 1000;
    if (data[0][0].x < firstTimestamp) {
      // only show data in range (+100 ms)
      const index = data[0].findIndex(value => value.x >= firstTimestamp - 100);
      data = data.map(values => values.slice(index));
    }

    // calculate paths for data
    let xRange = extent(data[0], p => new Date(p.x));
    if (xRange[1] - xRange[0] < nextProps.time * 1000) {
      xRange[0] = xRange[1] - nextProps.time * 1000;
    }

    let yRange;

    if (nextProps.yUseMinMax) {
      yRange = [nextProps.yMin, nextProps.yMax];
    } else {
      yRange = [0, 0];

      data.map(values => {
        const range = extent(values, p => p.y);
        if (range[0] < yRange[0]) yRange[0] = range[0];
        if (range[1] > yRange[1]) yRange[1] = range[1];

        return values;
      });
    }
    
    // create scale functions for both axes
    const xScale = scaleTime().domain(xRange).range([leftMargin, nextProps.width]);
    const yScale = scaleLinear().domain(yRange).range([nextProps.height, bottomMargin]);

    const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(date => timeFormat("%M:%S")(date));
    const yAxis = axisLeft().scale(yScale).ticks(5);

    // generate paths from data
    const sparkLine = line().x(p => xScale(p.x)).y(p => yScale(p.y));
    const lineColor = scaleOrdinal(schemeCategory10);

    const lines = data.map((values, index) => <path d={sparkLine(values)} key={index} style={{ fill: 'none', stroke: lineColor(index) }} />);

    this.setState({ data: lines, xAxis, yAxis });
  }

  render() {
    return <svg width={this.props.width + leftMargin} height={this.props.height + bottomMargin}>
      <g ref={node => select(node).call(this.state.xAxis)} style={{ transform: `translateY(${this.props.height}px)` }} />
      <g ref={node => select(node).call(this.state.yAxis)} style={{ transform: `translateX(${leftMargin}px)`}} />

      <g>
        {this.state.data}
      </g>
    </svg>;
  }
}

export default Plot;
