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
    const xScale = scaleTime().domain([Date.now() - props.time * 1000, Date.now()]).range([leftMargin, props.width]);
    let yScale;

    if (props.yUseMinMax) {
      yScale = scaleLinear().domain([props.yMin, props.yMax]).range([props.height, bottomMargin]);
    } else {
      yScale = scaleLinear().domain([0, 10]).range([props.height, bottomMargin]);
    }

    const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(date => timeFormat("%M:%S")(date));
    const yAxis = axisLeft().scale(yScale).ticks(5);

    this.state = {
      data: null,
      lines: null,
      xAxis,
      yAxis
    };
  }

  componentDidMount() {
    this.createInterval();
  }

  componentWillUnmount() {
    this.removeInterval();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.time !== this.props.time) {
      this.createInterval();
    }

    // check if data is invalid
    if (nextProps.data == null || nextProps.data.length === 0 || nextProps.data[0].length === 0) {
      // create empty plot axes
      const xScale = scaleTime().domain([Date.now() -  nextProps.time * 1000, Date.now()]).range([leftMargin, nextProps.width]);
      let yScale;
      
      if (nextProps.yUseMinMax) {
        yScale = scaleLinear().domain([nextProps.yMin, nextProps.yMax]).range([nextProps.height, bottomMargin]);
      } else {
        yScale = scaleLinear().domain([0, 10]).range([nextProps.height, bottomMargin]);
      }
  
      const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(date => timeFormat("%M:%S")(date));
      const yAxis = axisLeft().scale(yScale).ticks(5);

      this.setState({ data: null, xAxis, yAxis });
      return;
    }

    // only show data in requested time
    let data = nextProps.data;
    
    const firstTimestamp = data[0][data[0].length - 1].x - (nextProps.time + 1) * 1000;
    if (data[0][0].x < firstTimestamp) {
      // only show data in range (+100 ms)
      const index = data[0].findIndex(value => value.x >= firstTimestamp - 100);
      data = data.map(values => values.slice(index));
    }

    this.setState({ data });
  }

  createInterval() {
    this.removeInterval();

    if (this.props.time < 30) {
      this.interval = setInterval(this.tick, 50);
    } else if (this.props.time < 120) {
      this.interval = setInterval(this.tick, 100);
    } else if (this.props.time < 300) {
      this.interval = setInterval(this.tick, 200);
    } else {
      this.interval = setInterval(this.tick, 1000);
    }
  }

  removeInterval() {
    if (this.interval != null) {
      clearInterval(this.interval);

      this.interval = null;
    }
  }

  tick = () => {
    if (this.state.data == null || this.props.paused === true) {
      this.setState({ lines: null });
      return;
    }

    // calculate yRange
    let yRange = [0, 0];
    
    if (this.props.yUseMinMax) {
      yRange = [this.props.yMin, this.props.yMax];
    } else if (this.props.data.length > 0) {
      yRange = [this.props.data[0][0].y, this.props.data[0][0].y];

      this.props.data.forEach(values => {
        const range = extent(values, p => p.y);

        if (range[0] < yRange[0]) yRange[0] = range[0];
        if (range[1] > yRange[1]) yRange[1] = range[1];
      });
    }

    // create scale functions for both axes
    const xScale = scaleTime().domain([Date.now() - this.props.time * 1000, Date.now()]).range([leftMargin, this.props.width]);
    const yScale = scaleLinear().domain(yRange).range([this.props.height, bottomMargin]);

    const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(date => timeFormat("%M:%S")(date));
    const yAxis = axisLeft().scale(yScale).ticks(5);

    // generate paths from data
    const sparkLine = line().x(p => xScale(p.x)).y(p => yScale(p.y));
    const lineColor = scaleOrdinal(schemeCategory10);

    const lines = this.state.data.map((values, index) => <path d={sparkLine(values)} key={index} style={{ fill: 'none', stroke: lineColor(index) }} />);

    this.setState({ lines, xAxis, yAxis });
  }

  render() {
    return <svg width={this.props.width + leftMargin} height={this.props.height + bottomMargin}>
      <g ref={node => select(node).call(this.state.xAxis)} style={{ transform: `translateY(${this.props.height}px)` }} />
      <g ref={node => select(node).call(this.state.yAxis)} style={{ transform: `translateX(${leftMargin}px)`}} />

      <defs>
        <clipPath id="lineClipPath">
          <rect x={leftMargin} y={bottomMargin} width={this.props.width} height={this.props.height} />
        </clipPath>
      </defs>

      <g style={{ clipPath: 'url(#lineClipPath)' }}>
        {this.state.lines}
      </g>
    </svg>;
  }
}

export default Plot;
