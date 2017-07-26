/**
 * File: plot.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 10.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';
import { line } from 'd3-shape';
import { axisBottom, axisLeft } from  'd3-axis';
import { select } from 'd3-selection';

class Plot extends React.Component {
  render() {
    // check if data is valid
    if (this.props.data == null || this.props.data.length === 0) return false;
    
    // only show data in requested time
    let data = this.props.data;

    const firstTimestamp = data[data.length - 1].x - this.props.time * 1000;
    if (data[0].x < firstTimestamp) {
      const index = data.findIndex(value => value.x >= firstTimestamp - 100);
      if (index > 0) {
        data = data.slice(index - 1);
      }
    }

    // calculate paths for data
    const leftMargin = 30;
    const bottomMargin = 20;

    let xRange = extent(data, p => new Date(p.x));
    if (xRange[1] - xRange[0] < this.props.time * 1000) {
      xRange[0] = xRange[1] - this.props.time * 1000;
    }
    
    const xScale = scaleTime().domain(xRange).range([leftMargin, this.props.width]);
    const yScale = scaleLinear().domain(extent(data, p => p.y)).range([this.props.height, bottomMargin]);

    const xAxis = axisBottom().scale(xScale).ticks(5);
    const yAxis = axisLeft().scale(yScale).ticks(5);

    const sparkLine = line().x(p => xScale(p.x)).y(p => yScale(p.y));
    const linePath = sparkLine(data);

    return(
      <svg width={this.props.width + leftMargin} height={this.props.height + bottomMargin}>
        <g ref={node => select(node).call(xAxis)} style={{ transform: `translateY(${this.props.height}px)` }} />
        <g ref={node => select(node).call(yAxis)} style={{ transform: `translateX(${leftMargin}px)`}} />

        <g style={{ fill: 'none', stroke: 'blue' }}>
          <path d={linePath} />
        </g>
      </svg>
    );
  }
}

export default Plot;
