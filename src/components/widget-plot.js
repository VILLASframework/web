/**
 * File: widget-plot.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 08.03.2017
 *
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

import Plot from './widget-plot/plot';
import PlotLegend from './widget-plot/plot-legend';

class WidgetPlot extends React.Component {
  render() {
    const simulator = this.props.widget.simulator;
    const simulation = this.props.simulation;
    let legendSignals = [];
    let simulatorData = [];

    // Proceed if a simulation with models and a simulator are available
    if (simulator && simulation && simulation.models.length > 0) {

      const model = simulation.models.find( model => model.simulator.node === simulator.node && model.simulator.simulator === simulator.simulator );
      const chosenSignals = this.props.widget.signals;

      simulatorData = this.props.data[simulator.node][simulator.simulator].values.filter((values, index) => (
        this.props.widget.signals.findIndex(value => value === index) !== -1
      ));

      // Query the signals that will be displayed in the legend
      legendSignals = model.mapping.reduce( (accum, model_signal, signal_index) => {
        if (chosenSignals.includes(signal_index)) {
          accum.push({ index: signal_index, name: model_signal.name });
        }
        return accum;
      }, []);
    }

    return (
      <div className="plot-widget" ref="wrapper">
        <div className="widget-plot">
          <Plot
            data={simulatorData}
            height={this.props.widget.height - 55}
            width={this.props.widget.width - 20}
            time={this.props.widget.time}
          />
        </div>

        <PlotLegend signals={legendSignals} />
      </div>
    );
  }
}

export default WidgetPlot;
