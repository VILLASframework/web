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

import Plot from '../widget-plot/plot';
import PlotLegend from '../widget-plot/plot-legend';

class WidgetPlot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      legend: []
    };
  }


  static getDerivedStateFromProps(props, state){

    if (props.config == null) {
      return{
        data: [],
        legend: [],
      };
    }

    const ic = props.config.icID;

    // Proceed if a config and a IC are available
    if (ic && props.data[ic] != null && props.data[ic] != null && props.data[ic].output != null && props.data[ic].output.values != null) {
      const chosenSignals = props.widget.customProperties.signals;

      const data = props.data[ic].output.values.filter((values, index) => (
        props.widget.customProperties.signals.findIndex(value => value === index) !== -1
      ));

      // Query the signals that will be displayed in the legend
      const legend = props.config.outputMapping.reduce( (accum, signal, signal_index) => {
        if (chosenSignals.includes(signal_index)) {
          accum.push({ index: signal_index, name: signal.name, type: signal.unit });
        }

        return accum;
      }, []);

      return{
        data: data,
        legend: legend,
      };
    } else {
      return{
        data: [],
        legend: [],
      };
    }

  }

  render() {
    return <div className="plot-widget" ref="wrapper">
      <div className="widget-plot">
        <Plot
          data={this.state.data}
          height={this.props.widget.height - 55}
          width={this.props.widget.width - 20}
          time={this.props.widget.customProperties.time}
          yMin={this.props.widget.customProperties.yMin}
          yMax={this.props.widget.customProperties.yMax}
          yUseMinMax={this.props.widget.customProperties.yUseMinMax}
          paused={this.props.paused}
          yLabel={this.props.widget.customProperties.ylabel}
        />
      </div>
      <PlotLegend signals={this.state.legend} />
    </div>;
  }
}

export default WidgetPlot;
