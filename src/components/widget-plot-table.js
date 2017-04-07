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
      firstTimestamp: 0,
      latestTimestamp: 0,
      sequence: null,
      values: [],
      preselectedSignals: [],
      signals: []
    };
  }

  componentWillReceiveProps(nextProps) {
    // check data
    const simulator = nextProps.widget.simulator;

    // plot size
    this.setState({ size: { w: this.props.widget.width - 100, h: this.props.widget.height - 20 }});

    // Update internal selected signals state with props (different array objects)
    if (this.props.widget.signals !== nextProps.widget.signals) {
      this.setState( {signals: nextProps.widget.signals});
    }

    // Identify if there was a change in the preselected signals
    if (nextProps.simulation && (JSON.stringify(nextProps.widget.preselectedSignals) !== JSON.stringify(this.props.widget.preselectedSignals) || this.state.preselectedSignals.length === 0)) {
      
      // Update the currently selected signals by intersecting with the preselected signals
      // Do the same with the plot values
      var intersection = this.computeIntersection(nextProps.widget.preselectedSignals, nextProps.widget.signals);
      this.setState({ 
          signals: intersection,
          values: this.state.values.filter( (values) => intersection.includes(values.index))
        });

      this.updatePreselectedSignalsState(nextProps);
      return;
    }

    // Identify simulation reset
    if (nextProps.simulation == null || nextProps.data == null || nextProps.data[simulator] == null || nextProps.data[simulator].length === 0 || nextProps.data[simulator].values[0].length === 0) {
      // clear values
      this.setState({ values: [], sequence: null });
      return;
    }

    // check if new data, otherwise skip
    if (this.state.sequence >= nextProps.data[simulator].sequence) {
      return;
    }

    this.updatePlotData(nextProps);
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

  updatePlotData(nextProps) {
    const simulator = nextProps.widget.simulator;

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
      // Include signal index, useful to relate them to the signal selection
      values.push(
        { 
          index: signal_index,
          values: nextProps.data[simulator].values[signal_index].slice(firstIndex, nextProps.data[simulator].values[signal_index].length - 1)})
    ));

    this.setState({ values: values, firstTimestamp: firstTimestamp, latestTimestamp: latestTimestamp, sequence: nextProps.data[simulator].sequence });
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
                data={this.state.values }
                colors={ scaleOrdinal(schemeCategory10) }
                gridHorizontal={true}
                xAccessor={(d) => { if (d != null) { return new Date(d.x); } }}
                xAxisTickCount={ tickCount }
                hoverAnimation={false}
                circleRadius={0}
                domain={{ x: [this.state.firstTimestamp, this.state.latestTimestamp] }}
              />
            }
            <div>
              { 
                this.state.signals.map((signal) => 
                  ({signal} + ',')
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WidgetPlotTable;
