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

class WidgetPlotTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: { w: 0, h: 0 },
      signals: [],
      firstTimestamp: 0,
      latestTimestamp: 0,
      sequence: null,
      signalsOfCurrType: [],
      values: [],
      active_sim_model: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    // check data
    const simulator = nextProps.widget.simulator;

    // plot size
    this.setState({ size: { w: this.props.widget.width - 100, h: this.props.widget.height - 20 }});

    if (nextProps.widget.signalType !== this.props.widget.signalType) {
      this.setState({ signals: []});
    }

    if (nextProps.simulation == null || nextProps.data == null || nextProps.data[simulator] == null || nextProps.data[simulator].length === 0 || nextProps.data[simulator].values[0].length === 0) {
      // clear values
      this.setState({ values: [], sequence: null, signalsOfCurrType: [] });
      return;
    }

    // check if new data, otherwise skip
    if (this.state.sequence >= nextProps.data[simulator].sequence) {
      return;
    }

    // get simulation model
    const simulationModel = nextProps.simulation.models.find((model, model_index) => {
      var found = false;
      if (model.simulator === simulator) {
        this.setState({ active_sim_model: model_index });
        found = true;
      }
      return found;
    });

    // get signals belonging to the currently selected type
    var filteredSignals = {};
    simulationModel.mapping
                .filter( (signal) => 
                  signal.type.toLowerCase() === nextProps.widget.signalType)
                .forEach((signal) => {
                  // Store signals to be shown in a dictionary
                  filteredSignals[signal.name.toLowerCase()] = '';
                });

    // get timestamps
    var latestTimestamp = nextProps.data[simulator].values[0][nextProps.data[simulator].values[0].length - 1].x;
    var firstTimestamp = latestTimestamp - nextProps.widget.time * 1000;
    var firstIndex;

    if (nextProps.data[simulator].values[0][0].x < firstTimestamp) {
      // find element index representing firstTimestamp
      firstIndex = nextProps.data[simulator].values[0].findIndex((value) => {
        return value.x >= firstTimestamp;
      });
    } else {
      firstIndex = 0;
      firstTimestamp = nextProps.data[simulator].values[0][0].x;
      latestTimestamp = firstTimestamp + nextProps.widget.time * 1000;
    }

    // copy all values for each signal in time region
    var values = [];
    this.state.signals.forEach((signal_index, i, arr) => (
      values.push(
        { values: nextProps.data[simulator].values[signal_index].slice(firstIndex, nextProps.data[simulator].values[signal_index].length - 1)})
    ));

    this.setState({ values: values, firstTimestamp: firstTimestamp, latestTimestamp: latestTimestamp, sequence: nextProps.data[simulator].sequence, signalsOfCurrType: filteredSignals });
  }
  
  updateSignalSelection(signal_index, checked) {
    // If the signal is selected, add it to array, remove it otherwise
    this.setState({ 
      signals: checked? this.state.signals.concat(signal_index) : this.state.signals.filter( (idx) => idx !== signal_index )
    });
  }

  render() {
    var checkBoxes = [];
    if (this.state.signalsOfCurrType && Object.keys(this.state.signalsOfCurrType).length > 0) {
      // Create checkboxes using the signal indices from simulation model
      checkBoxes = this.props.simulation.models[this.state.active_sim_model].mapping.reduce(
        // Loop through simulation model signals
        (accum, model_signal, signal_index) => {
          // Append them if they belong to the current selected type
          if (this.state.signalsOfCurrType.hasOwnProperty(model_signal.name.toLowerCase())) {
              // Tag as active if it is currently selected
              var chkBxClasses = classNames({
                'btn': true,
                'btn-default': true,
                'active': this.state.signals.indexOf(signal_index) > -1
              });
              accum.push(
                <Checkbox key={signal_index} className={chkBxClasses} disabled={ this.props.editing } onChange={(e) => this.updateSignalSelection(signal_index, e.target.checked) } > { model_signal.name } </Checkbox>
              )
            }
            return accum;
          }, []);
    }

    // Make tick count proportional to the plot width using a rough scale ratio
    var tickCount = Math.round(this.state.size.w / 80);
    
    return (
      <div className="plot-table-widget" ref="wrapper">
        <h4>{this.props.widget.name}</h4>

        <div className="content">
          <div className="widget-table">
            { checkBoxes.length > 0 ? (
              <FormGroup className="btn-group-vertical">
                { checkBoxes }
              </FormGroup>
              ) : ( <small>No signal found, select a different signal type.</small> )
            }
          </div>

          <div className="widget-plot">
            {this.state.sequence &&
              <LineChart
                width={ this.state.size.w || 100 }
                height={ this.state.size.h || 100 }
                data={this.state.values}
                colors={ scaleOrdinal(schemeCategory10) }
                gridHorizontal={true}
                xAccessor={(d) => { if (d != null) { return new Date(d.x); } }}
                xAxisTickCount={ tickCount }
                hoverAnimation={false}
                circleRadius={0}
                domain={{ x: [this.state.firstTimestamp, this.state.latestTimestamp] }}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default WidgetPlotTable;
