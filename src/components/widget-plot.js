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
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      legend: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const simulator = nextProps.widget.simulator;
    const simulation = nextProps.simulation;

    // Proceed if a simulation with models and a simulator are available
    if (simulator && nextProps.data[simulator.node] != null && nextProps.data[simulator.node][simulator.simulator] != null && simulation && simulation.models.length > 0) {
      const model = simulation.models.find(model => model.simulator.node === simulator.node && model.simulator.simulator === simulator.simulator);
      const chosenSignals = nextProps.widget.signals;

      const data = nextProps.data[simulator.node][simulator.simulator].values.filter((values, index) => (
        nextProps.widget.signals.findIndex(value => value === index) !== -1
      ));

      // Query the signals that will be displayed in the legend
      const legend = model.mapping.reduce( (accum, model_signal, signal_index) => {
        if (chosenSignals.includes(signal_index)) {
          accum.push({ index: signal_index, name: model_signal.name });
        }
        
        return accum;
      }, []);

      this.setState({ data, legend });
    } else {
      this.setState({ data: [], legend: [] });
    }
  }

  render() {
    return <div className="plot-widget" ref="wrapper">
      <div className="widget-plot">
        <Plot
          data={this.state.data}
          height={this.props.widget.height - 55}
          width={this.props.widget.width - 20}
          time={this.props.widget.time}
          yMin={this.props.widget.yMin}
          yMax={this.props.widget.yMax}
          yUseMinMax={this.props.widget.yUseMinMax}
        />
      </div>

      <PlotLegend signals={this.state.legend} />
    </div>;
  }
}

export default WidgetPlot;
