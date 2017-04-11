/**
 * File: widget-plot.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 08.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';

import Plot from './widget-plot/plot';
import PlotLegend from './widget-plot/plot-legend';

class WidgetPlot extends Component {

  render() {
    if (this.props.simulation == null) {
      return (<div>Empty</div>);
    }

    let simulator = this.props.widget.simulator;
    let simulation = this.props.simulation;
    let model = simulation.models.find( (model) => model.simulator === simulator );
    let chosenSignals = this.props.widget.signals;

    let simulatorData = this.props.data[simulator];

    // Query the signals that will be displayed in the legend
    let legendSignals = model.mapping.reduce( (accum, model_signal, signal_index) => {
        if (chosenSignals.includes(signal_index)) {
          accum.push({ index: signal_index, name: model_signal.name });
        }
        return accum;
      }, []);

    return (
      <div className="plot-widget" ref="wrapper">
        <h4>{this.props.widget.name}</h4>
        
        <div className="widget-plot">
          <Plot signals={ this.props.widget.signals } time={ this.props.widget.time } simulatorData={ simulatorData } />
        </div>
        <PlotLegend signals={legendSignals} />
      </div>
    );
  }
}

export default WidgetPlot;
