/**
 * File: plot-table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
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

import React, { Component } from 'react';
import classNames from 'classnames';
import { FormGroup, FormCheck } from 'react-bootstrap';

import Plot from '../widget-plot/plot';
import PlotLegend from '../widget-plot/plot-legend';

class WidgetPlotTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preselectedSignals: [],
      signals: []
    };
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (this.props.simulationModel == null) {
      return;
    }

    // Update internal selected signals state with props (different array objects)
    if (prevProps.widget.customProperties.signals !== this.props.widget.customProperties.signals) {
      this.setState( {signals: this.props.widget.customProperties.signals});
    }

    // Identify if there was a change in the preselected signals
    if (JSON.stringify(prevProps.widget.customProperties.preselectedSignals) !== JSON.stringify(this.props.widget.customProperties.preselectedSignals)
      || this.state.preselectedSignals.length === 0) {
      // Update the currently selected signals by intersecting with the preselected signalsWidget
      // Do the same with the plot values
      var intersection = this.computeIntersection(this.props.widget.customProperties.preselectedSignals, this.props.widget.customProperties.signals);
      this.setState({ signals: intersection });

      this.updatePreselectedSignalsState(this.props);
    }
  }

  // Perform the intersection of the lists, alternatively could be done with Sets ensuring unique values
  computeIntersection(preselectedSignals, selectedSignals) {
    return preselectedSignals.filter( s => selectedSignals.includes(s));
  }

  updatePreselectedSignalsState(props) {
    // Create checkboxes using the signal indices from simulation model
    if(props.simulationModel.outputMapping){
    const preselectedSignals = props.simulationModel.outputMapping.reduce(
      // Loop through simulation model signals
      (accum, model_signal, signal_index) => {
        // Append them if they belong to the current selected type
        if (props.widget.customProperties.preselectedSignals.indexOf(signal_index) > -1) {
            accum.push(
              {
                index: signal_index,
                name: model_signal.name,
                type: model_signal.type
              }
            )
          }
          return accum;
        }, []);

    this.setState({ preselectedSignals });
      }
  }

  updateSignalSelection(signal_index, checked) {
    // Update the selected signals and propagate to parent component
    var new_widget = Object.assign({}, this.props.widget, {
      signals: checked? this.state.signals.concat(signal_index) : this.state.signals.filter( (idx) => idx !== signal_index )
    });
    this.props.onWidgetChange(new_widget);
  }

  render() {
    let checkBoxes = [];

    // Data passed to plot
    if (this.props.simulationModel == null) {
      return <div />;
    }

    const simulator = this.props.simulationModel.simulator;
    let simulatorData = [];

    if (this.props.data[simulator] != null && this.props.data[simulator].output != null && this.props.data[simulator].output.values != null) {
      simulatorData = this.props.data[simulator].output.values.filter((values, index) => (
        this.props.widget.customProperties.signals.findIndex(value => value === index) !== -1
      ));
    }

    if (this.state.preselectedSignals && this.state.preselectedSignals.length > 0) {
      // Create checkboxes using the signal indices from simulation model
      checkBoxes = this.state.preselectedSignals.map( (signal) => {
        var checked = this.state.signals.indexOf(signal.index) > -1;
        var chkBxClasses = classNames({
          'btn': true,
          'btn-default': true,
          'active': checked
        });
        return <FormCheck key={signal.index} className={chkBxClasses} checked={checked} disabled={ this.props.editing } onChange={(e) => this.updateSignalSelection(signal.index, e.target.checked) } > { signal.name } </FormCheck>
      });
    }

    // Prepare an array with the signals to show in the legend
    var legendSignals = this.state.preselectedSignals.reduce( (accum, signal, i) => {
      if (this.state.signals.includes(signal.index)) {
        accum.push({
          index: signal.index,
          name: signal.name,
          type: signal.type
        });
      }
      return accum;
    }, []);

    return (
      <div className="plot-table-widget" ref="wrapper">
        <div className="content">
          <div className="table-plot-row">
            <div className="widget-table">
              { checkBoxes.length > 0 ? (
                <FormGroup className="btn-group-vertical">
                  { checkBoxes }
                </FormGroup>
                ) : ( <small>No signal has been pre-selected.</small> )
              }
            </div>

            <div className="widget-plot">
              <Plot
                data={simulatorData}
                time={this.props.widget.customProperties.time}
                width={this.props.widget.width - 100}
                height={this.props.widget.height - 55}
                yMin={this.props.widget.customProperties.yMin}
                yMax={this.props.widget.customProperties.yMax}
                yUseMinMax={this.props.widget.customProperties.yUseMinMax}
                paused={this.props.paused}
                yLabel={this.props.widget.customProperties.ylabel}
              />
            </div>
          </div>
          <PlotLegend signals={legendSignals} />
        </div>
      </div>
    );
  }
}

export default WidgetPlotTable;
