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
const rightMargin = 10;

let uniqueIdentifier = 0;

class Plot extends React.Component {
  constructor(props) {
    super(props);

    // create dummy axes
    let labelMargin = 0;
    if (props.yLabel !== '') {
      labelMargin = 20;
    }

    const xScale = scaleTime().domain([Date.now() - props.time * 1000, Date.now()]).range([0, props.width - leftMargin - labelMargin - rightMargin]);
    let yScale;

    if (props.yUseMinMax) {
      yScale = scaleLinear().domain([props.yMin, props.yMax]).range([props.height - bottomMargin, 0]);
    } else {
      yScale = scaleLinear().domain([0, 10]).range([props.height - bottomMargin, 0]);
    }

    const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(date => timeFormat("%M:%S")(date));
    const yAxis = axisLeft().scale(yScale).ticks(5);

    this.state = {
      data: null,
      lines: null,
      xAxis,
      yAxis,
      labelMargin,
      identifier: uniqueIdentifier++
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

    let labelMargin = 0;
    if (nextProps.yLabel !== '') {
      labelMargin = 20;
    }

    // check if data is invalid
    if (nextProps.data == null || nextProps.data.length === 0 || nextProps.data[0].length === 0) {
      // create empty plot axes
      const xScale = scaleTime().domain([Date.now() -  nextProps.time * 1000, Date.now()]).range([0, nextProps.width - leftMargin - labelMargin - rightMargin]);
      let yScale;
      
      if (nextProps.yUseMinMax) {
        yScale = scaleLinear().domain([nextProps.yMin, nextProps.yMax]).range([nextProps.height - bottomMargin, 0]);
      } else {
        yScale = scaleLinear().domain([0, 10]).range([nextProps.height - bottomMargin, 0]);
      }
  
      const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(date => timeFormat("%M:%S")(date));
      const yAxis = axisLeft().scale(yScale).ticks(5);

      this.setState({ data: null, xAxis, yAxis, labelMargin });
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

    this.setState({ data, labelMargin });
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
    const xScale = scaleTime().domain([Date.now() - this.props.time * 1000, Date.now()]).range([0, this.props.width - leftMargin - this.state.labelMargin - rightMargin]);
    const yScale = scaleLinear().domain(yRange).range([this.props.height - bottomMargin, 5]);

    const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(date => timeFormat("%M:%S")(date));
    const yAxis = axisLeft().scale(yScale).ticks(5);

    // generate paths from data
    const sparkLine = line().x(p => xScale(p.x)).y(p => yScale(p.y));
    const lineColor = scaleOrdinal(schemeCategory10);

    const lines = this.state.data.map((values, index) => <path d={sparkLine(values)} key={index} style={{ fill: 'none', stroke: lineColor(index) }} />);

    this.setState({ lines, xAxis, yAxis });
  }

  render() {
    const yLabelPos = {
      x: 12,
      y: this.props.height / 2
    }

    return <svg width={this.props.width - rightMargin + 1} height={this.props.height + bottomMargin}>
      <g ref={node => select(node).call(this.state.xAxis)} style={{ transform: `translateX(${leftMargin + this.state.labelMargin}px) translateY(${this.props.height - bottomMargin}px)` }} />
      <g ref={node => select(node).call(this.state.yAxis)} style={{ transform: `translateX(${leftMargin + this.state.labelMargin}px)`}} />
      
      <text strokeWidth="0.01" textAnchor="middle" x={yLabelPos.x} y={yLabelPos.y} transform={`rotate(270 ${yLabelPos.x} ${yLabelPos.y})`}>{this.props.yLabel}</text>
      <text strokeWidth="0.01" textAnchor="end" x={this.props.width - rightMargin} y={this.props.height + bottomMargin - 5}>Time [s]</text>

      <defs>
        <clipPath id={"lineClipPath" + this.state.identifier}>
          <rect x={leftMargin + this.state.labelMargin} y={0} width={this.props.width - leftMargin - this.state.labelMargin - rightMargin} height={this.props.height - bottomMargin} />
        </clipPath>
      </defs>

      <g style={{ clipPath: 'url(#lineClipPath' + this.state.identifier + ')' }}>
        {this.state.lines}
      </g>
    </svg>;
  }
}

export default Plot;
