/**
 * File: widget-plot.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 08.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { LineChart } from 'rd3';

class WidgetPlot extends Component {
  render() {
    // get selected simulation model
    const widget = this.props.widget;
    var simulationModel;

    if (this.props.simulation && this.props.simulation.models && this.props.data[widget.simulator]) {
      this.props.simulation.models.forEach((model) => {
        if (model.simulator === widget.simulator) {
          simulationModel = model;
        }
      });
    } else {
      return (<div></div>);
    }

    if (widget.plotType === 'table') {
      return (
        <div>Table</div>
      );
    } else if (widget.plotType === 'multiple') {
      // get selected data
      var lineData = [];
      const latestTimestamp = this.props.data[widget.simulator].values[0][this.props.data[widget.simulator].values[0].length - 1].x;

      widget.signals.forEach((signal) => {
        lineData.push({
          name: simulationModel.mapping[signal].name,
          values: this.props.data[widget.simulator].values[signal]
        });
      });

      return (
        <div style={{ width: '100%', height: '100%' }} ref="wrapper">
          <LineChart
            width={widget.width}
            height={widget.height - 20}
            data={lineData}
            title={widget.name}
            gridHorizontal={true}
            xAccessor={(d) => {return new Date(d.x);}}
            hoverAnimation={false}
            circleRadius={0}
            domain={{ x: [latestTimestamp - 10000, latestTimestamp] }}
          />
        </div>
      );
    } else {
      return (<div>Error</div>);
    }
  }
}

export default WidgetPlot;
