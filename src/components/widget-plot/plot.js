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
import { extent, max } from 'd3-array';
import { line } from 'd3-shape';
import { axisBottom, axisLeft } from  'd3-axis';
import { select } from 'd3-selection';

class Plot extends React.Component {
  render() {
    const leftMargin = 30;
    const bottomMargin = 20;
    const values = 100;

    let data = this.props.data;

    if (data.length > values) {
      data = data.slice(data.length - values);
    }

    const xScale = scaleTime().domain(extent(data, p => new Date(p.x))).range([leftMargin, this.props.width]);
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
