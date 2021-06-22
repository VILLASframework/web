/**
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

import React from 'react';
import { scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic'
import { extent } from 'd3-array';
import { line } from 'd3-shape';
import { axisBottom, axisLeft } from  'd3-axis';
import { select } from 'd3-selection';
import { timeFormat } from 'd3-time-format';
import { format } from 'd3';

const topMargin = 10;
const bottomMargin = 25;
const leftMargin = 40;
const rightMargin = 10;

let uniqueIdentifier = 0;

class Plot extends React.Component {
  constructor(props) {
    super(props);
    // create dummy axes
    let labelMargin = 0;
    if (props.yLabel !== '') {
      labelMargin = 30;
    }

    const xScale = scaleTime().domain([Date.now() - props.time * 1000, Date.now()]).range([0, props.width - leftMargin - labelMargin - rightMargin]);
    let yScale;

    if (props.yUseMinMax) {
      yScale = scaleLinear().domain([props.yMin, props.yMax]).range([props.height + topMargin - bottomMargin, topMargin]);
    } else {
      yScale = scaleLinear().domain([0, 10]).range([props.height + topMargin - bottomMargin, topMargin]);
    }

    const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(timeFormat("%M:%S"));
    const yAxis = axisLeft().scale(yScale).ticks(5).tickFormat(format(".3s"));

    this.state = {
      data: null,
      lines: null,
      xAxis,
      yAxis,
      labelMargin,
      identifier: uniqueIdentifier++,
      stopTime: null,
      firstTimestamp: null
    };
  }

  componentDidMount() {
    this.createInterval();
  }

  componentWillUnmount() {
    this.removeInterval();
  }

  static getDerivedStateFromProps(props, state){

    let labelMargin = 0;
    if (props.yLabel !== '') {
      labelMargin = 30;
    }

    // check if data is invalid
    if (props.data == null || props.data.length === 0) {
      // create empty plot axes
      let xScale;
      let yScale;
      let stopTime;

      if(!props.paused){
        xScale = scaleTime().domain([Date.now() -  props.time * 1000, Date.now()]).range([0, props.width - leftMargin - labelMargin - rightMargin]);
        stopTime = Date.now();
      }else{
        stopTime = state.stopTime;
        xScale = scaleLinear().domain([state.stopTime -  props.time * 1000, state.stopTime]).range([0, props.width - leftMargin - labelMargin - rightMargin]);
      }

      if (props.yUseMinMax) {
        yScale = scaleLinear().domain([props.yMin, props.yMax]).range([props.height + topMargin - bottomMargin, topMargin]);
      } else {
        yScale = scaleLinear().domain([0, 10]).range([props.height + topMargin - bottomMargin, topMargin]);
      }

      const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(timeFormat("%M:%S"));
      const yAxis = axisLeft().scale(yScale).ticks(5).tickFormat(format(".3s"));


      return{
        stopTime: stopTime,
        data: null,
        xAxis,
        yAxis,
        labelMargin,
      };
    }

    // only show data in requested time
    let data = props.data;
    let icDataset = data.find(function (element) {
      return element !== undefined;
    })

    let firstTimestamp;
    if (props.mode === "last samples") {
      firstTimestamp = (data[0].length - 1 - props.samples) > 0 ? data[0][(data[0].length - 1) - props.samples].x : data[0][0].x;
      let tempTimestamp;

      for (let i = 1; i < props.signalIDs.length; i++) {
        if (typeof props.data[i] !== "undefined") {
          tempTimestamp = (data[i].length - 1 - props.samples) > 0 ? data[i][(data[i].length - 1) - props.samples].x : data[i][0].x;
          firstTimestamp = tempTimestamp < firstTimestamp ? tempTimestamp : firstTimestamp;
        }
      }

    }
    else {
      firstTimestamp = icDataset[icDataset.length - 1].x - (props.time + 1) * 1000;
      if (icDataset[0].x < firstTimestamp) {
        // only show data in range (+100 ms)
        const index = icDataset.findIndex(value => value.x >= firstTimestamp - 100);
        data = data.map(values => values.slice(index));
      }
    }


    return {
      data,
      labelMargin,
      firstTimestamp
    };

  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.time !== this.props.time) {
      this.createInterval();
    }
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

    if (this.state.data == null) {
      this.setState({ lines: null });
      return;
    }

    if (this.props.paused === true) {
      return;
    }

    // calculate yRange
    let yRange = [0, 0];

    if (this.props.yUseMinMax) {
      yRange = [this.props.yMin, this.props.yMax];
    } else if (this.props.data.length > 0) {
      let icDataset = this.props.data.find(function(element) {
        return element !== undefined;
      })

      yRange = [icDataset[0].y, icDataset[0].y];

      this.props.data.forEach(values => {
        const range = extent(values, p => p.y);

        if (range[0] < yRange[0]) yRange[0] = range[0];
        if (range[1] > yRange[1]) yRange[1] = range[1];
      });
    }

    // create scale functions for both axes
    let xScale;
    let data = this.props.data;
    if(this.props.mode === "last samples"){
        let lastTimestamp = data[0][data[0].length - 1].x;
  
        for (let i = 1; i < this.props.signalIDs.length; i++) {
          if (typeof data[i] !== "undefined") {
            lastTimestamp = data[i][data[i].length - 1].x > lastTimestamp ? data[i][data[i].length -1].x : lastTimestamp;
          }
        }


      xScale = scaleTime().domain([this.state.firstTimestamp, lastTimestamp]).range([0, this.props.width - leftMargin - this.state.labelMargin - rightMargin]);
    }
    else{
      xScale = scaleTime().domain([Date.now() - this.props.time * 1000, Date.now()]).range([0, this.props.width - leftMargin - this.state.labelMargin - rightMargin]);

    }
    const yScale = scaleLinear().domain(yRange).range([this.props.height + topMargin - bottomMargin, topMargin]);

    const xAxis = axisBottom().scale(xScale).ticks(5).tickFormat(timeFormat("%M:%S"));
    const yAxis = axisLeft().scale(yScale).ticks(5).tickFormat(format(".3s"));

    // generate paths from data
    const sparkLine = line().x(p => xScale(p.x)).y(p => yScale(p.y));

    const lines = this.state.data.map((values, index) => {
      let signalID = this.props.signalIDs[index];

      if(this.props.lineColors === undefined || this.props.lineColors === null){
        this.props.lineColors = [] // for backwards compatibility
      }

      if (typeof this.props.lineColors[index] === "undefined") {
        this.props.lineColors[index] = schemeCategory10[index % 10];
      }
      return <path d={sparkLine(values)} key={index} style={{ fill: 'none', stroke: this.props.lineColors[index] }} />
    });

    this.setState({ lines, xAxis, yAxis });
  }

  render() {

    const yLabelPos = {
      x: 12,
      y: this.props.height / 2
    }

    return <svg width={this.props.width - rightMargin + 1} height={this.props.height + topMargin + bottomMargin}>
      <g ref={node => select(node).call(this.state.xAxis)} style={{ transform: `translateX(${leftMargin + this.state.labelMargin}px) translateY(${this.props.height + topMargin - bottomMargin}px)` }} />
      <g ref={node => select(node).call(this.state.yAxis)} style={{ transform: `translateX(${leftMargin + this.state.labelMargin}px)` }} />

      <text strokeWidth="0.005" textAnchor="middle" x={yLabelPos.x} y={yLabelPos.y} transform={`rotate(270 ${yLabelPos.x} ${yLabelPos.y})`}>{this.props.yLabel}</text>
      <text strokeWidth="0.005" textAnchor="end" x={this.props.width - rightMargin} y={this.props.height + topMargin + bottomMargin - 10}>Time [s]</text>

      <defs>
        <clipPath id={"lineClipPath" + this.state.identifier}>
          <rect x={leftMargin + this.state.labelMargin} y={topMargin} width={this.props.width - leftMargin - this.state.labelMargin - rightMargin} height={this.props.height - bottomMargin} />
        </clipPath>
      </defs>

      <g style={{ clipPath: 'url(#lineClipPath' + this.state.identifier + ')' }}>
        {this.state.lines}
      </g>
    </svg>;
  }
}

export default Plot;
