/**
 * File: widget-plot-table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { LineChart } from 'rd3';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';
import classNames from 'classnames';
import { FormGroup, Checkbox } from 'react-bootstrap';

import Plot from './widget-plot/plot';
import PlotLegend from './widget-plot/plot-legend';

class WidgetPlotTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preselectedSignals: [],
      signals: []
    };
  }

  componentWillReceiveProps(nextProps) {
    // check data
    const simulator = nextProps.widget.simulator;

    // Update internal selected signals state with props (different array objects)
    if (this.props.widget.signals !== nextProps.widget.signals) {
      this.setState( {signals: nextProps.widget.signals});
    }

    // Identify if there was a change in the preselected signals
    if (nextProps.simulation && (JSON.stringify(nextProps.widget.preselectedSignals) !== JSON.stringify(this.props.widget.preselectedSignals) || this.state.preselectedSignals.length === 0)) {
      
      // Update the currently selected signals by intersecting with the preselected signals
      // Do the same with the plot values
      var intersection = this.computeIntersection(nextProps.widget.preselectedSignals, nextProps.widget.signals);
      this.setState({ signals: intersection });

      this.updatePreselectedSignalsState(nextProps);
      return;
    }

  }

  // Perform the intersection of the lists, alternatively could be done with Sets ensuring unique values
  computeIntersection(preselectedSignals, selectedSignals) {
    return preselectedSignals.filter( s => selectedSignals.includes(s));
  }
  
  updatePreselectedSignalsState(nextProps) {
    const simulator = nextProps.widget.simulator;

    // get simulation model
    const simulationModel = nextProps.simulation.models.find((model) => {
      return (model.simulator === simulator);
    });

    // Create checkboxes using the signal indices from simulation model
    const preselectedSignals = simulationModel.mapping.reduce(
      // Loop through simulation model signals
      (accum, model_signal, signal_index) => {
        // Append them if they belong to the current selected type
        if (nextProps.widget.preselectedSignals.indexOf(signal_index) > -1) {
            accum.push(
              {
                index: signal_index,
                name: model_signal.name
              }
            )
          }
          return accum;
        }, []);
      this.setState({ preselectedSignals: preselectedSignals });
  }

  updateSignalSelection(signal_index, checked) {
    // Update the selected signals and propagate to parent component
    var new_widget = Object.assign({}, this.props.widget, { 
      signals: checked? this.state.signals.concat(signal_index) : this.state.signals.filter( (idx) => idx !== signal_index )
    });
    this.props.onWidgetChange(new_widget);
  }

  render() {
    var checkBoxes = [];

    // Data passed to plot
    let simulator = this.props.widget.simulator;
    let simulatorData = this.props.data[simulator];

    if (this.state.preselectedSignals && this.state.preselectedSignals.length > 0) {
      // Create checkboxes using the signal indices from simulation model
      checkBoxes = this.state.preselectedSignals.map( (signal) => {
              var checked = this.state.signals.indexOf(signal.index) > -1;
              var chkBxClasses = classNames({
                'btn': true,
                'btn-default': true,
                'active': checked
              });
              return <Checkbox key={signal.index} className={chkBxClasses} checked={checked} disabled={ this.props.editing } onChange={(e) => this.updateSignalSelection(signal.index, e.target.checked) } > { signal.name } </Checkbox>
            });
    }

    // Prepare an array with the signals to show in the legend
    var legendSignals = this.state.preselectedSignals.reduce( (accum, signal, i) => {
                  if (this.state.signals.includes(signal.index)) {
                    accum.push({
                      index: signal.index,
                      name: signal.name
                    })
                  }
                  return accum;
                }, []);

    return (
      <div className="plot-table-widget" ref="wrapper">
        <h4>{this.props.widget.name}</h4>

        <div className="content">
          <div className="table-plot-row">
            <div className="widget-table">
              { checkBoxes.length > 0 ? (
                <FormGroup className="btn-group-vertical">
                  { checkBoxes }
                </FormGroup>
                ) : ( <small>No signal found, select a different signal type.</small> )
              }
            </div>

            <div className="widget-plot">
              <Plot signals={ this.state.signals } time={ this.props.widget.time } simulatorData={ simulatorData } />
            </div>
          </div>
          <PlotLegend signals={legendSignals} />
        </div>
      </div>
    );
  }
}

export default WidgetPlotTable;
