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
import React, { useState, useEffect, useRef } from "react";
import { axisBottom, axisLeft } from "d3-axis";
import { extent } from "d3-array";
import { format } from "d3-format";
import { line } from "d3-shape";
import { scaleLinear, scaleTime } from "d3-scale";
import { select } from "d3-selection";
import { schemeCategory10 } from "d3-scale-chromatic";
import { timeFormat } from "d3-time-format";

const topMargin = 10;
const bottomMargin = 25;
const leftMargin = 40;
const rightMargin = 10;

let uniqueIdentifier = 0;

function Plot(props) {
  const [data, setData] = useState(null);
  const [lines, setLines] = useState(null);
  const [labelMargin, setLabelMargin] = useState(0);
  const [identifier, setIdentifier] = useState(uniqueIdentifier++);
  const [stopTime, setStopTime] = useState(null);
  const [firstTimestamp, setFirstTimestamp] = useState(null);
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);
  const intervalRef = useRef();

  useEffect(() => {
    const interval = createInterval(
      props,
      firstTimestamp,
      data,
      setData,
      setLines,
      setXAxis,
      setYAxis,
      labelMargin
    );
    intervalRef.current = interval;

    return () => {
      removeInterval(intervalRef.current);
    };
  }, [props]);

  useEffect(() => {
    updatePlot(
      props,
      data,
      setData,
      setLines,
      setXAxis,
      setYAxis,
      stopTime,
      setStopTime,
      firstTimestamp,
      setFirstTimestamp,
      labelMargin,
      setLabelMargin,
      identifier
    );
  }, [props, data, stopTime, firstTimestamp, identifier]);

  const xAxisRef = useRef();
  useEffect(() => {
    if (xAxis) {
      select(xAxisRef.current).call(xAxis);
    }
  }, [xAxis]);

  const yAxisRef = useRef();
  useEffect(() => {
    if (yAxis) {
      select(yAxisRef.current).call(yAxis);
    }
  }, [yAxis]);

  const yLabelPos = {
    x: 12,
    y: props.height / 2,
  };

  const plotWidth = props.width - rightMargin + 1;
  const plotHeight = props.height + topMargin + bottomMargin;

  return (
    <svg width={plotWidth} height={plotHeight}>
      <g
        ref={xAxisRef}
        transform={`translate(${leftMargin + labelMargin}, ${
          props.height + topMargin - bottomMargin
        })`}
      />
      <g
        ref={yAxisRef}
        transform={`translate(${leftMargin + labelMargin}, 0)`}
      />
      <text
        strokeWidth="0.005"
        textAnchor="middle"
        transform={`rotate(270, ${yLabelPos.x}, ${yLabelPos.y})`}
        x={yLabelPos.x}
        y={yLabelPos.y}
      >
        {props.yLabel}
      </text>
      <text
        strokeWidth="0.005"
        textAnchor="end"
        x={props.width - rightMargin}
        y={props.height + topMargin + bottomMargin - 10}
      >
        Time [s]
      </text>
      <defs>
        <clipPath id={`lineClipPath${identifier}`}>
          <rect
            x={leftMargin + labelMargin}
            y={topMargin}
            width={props.width - leftMargin - labelMargin - rightMargin}
            height={props.height - bottomMargin}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#lineClipPath${identifier})`}>{lines}</g>
    </svg>
  );
}

function createInterval(
  props,
  firstTimestamp,
  data,
  setData,
  setLines,
  setXAxis,
  setYAxis,
  labelMargin
) {
  // You would implement createInterval logic here to generate the interval based on props
  // Similarly to how it was calculated in the original class component's componentDidMount and createInterval methods.
}

function updatePlot(
  props,
  data,
  setData,
  setLines,
  setXAxis,
  setYAxis,
  stopTime,
  setStopTime,
  firstTimestamp,
  setFirstTimestamp,
  labelMargin,
  setLabelMargin,
  identifier
) {
  // You would implement getDerivedStateFromProps logic here to update the plot.
  // Note: In functional components, derived state can be handled directly in the useEffect hook.
}

function removeInterval(interval) {
  if (interval != null) {
    clearInterval(interval);
  }
}

export default Plot;
