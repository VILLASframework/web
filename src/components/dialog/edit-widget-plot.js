/**
 * File: edit-widget-plot.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 13.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Checkbox, HelpBlock } from 'react-bootstrap';

class EditPlotWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        simulator: '',
        signals: [],
        time: 0
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ widget: nextProps.widget });
  }

  handleSignalChange(e, index) {
    var signals = this.state.widget.signals;

    if (e.target.checked) {
      // add signal
      signals.push(index);
    } else {
      // remove signal
      const pos = signals.indexOf(index);
      if (pos > -1) {
        signals.splice(pos, 1);
      }
    }

    this.props.handleChange({ target: { id: 'signals', value: signals } });
  }

  render() {
    // get selected simulation model
    var simulationModel = {};

    if (this.props.simulation) {
      this.props.simulation.models.forEach((model) => {
        if (model.simulation === this.state.widget.simulation) {
          simulationModel = model;
        }
      });
    }

    return (
      <div>
        <FormGroup controlId="time">
          <ControlLabel>Time</ControlLabel>
          <FormControl type="number" min="1" max="300" placeholder="Enter time" value={this.state.widget.time} onChange={(e) => this.props.handleChange(e)} />
          <HelpBlock>Time in seconds</HelpBlock>
        </FormGroup>
        <FormGroup controlId="simulator">
          <ControlLabel>Simulator</ControlLabel>
          <FormControl componentClass="select" placeholder="Select simulator" value={this.state.widget.simulator} onChange={(e) => this.props.handleChange(e)}>
            {this.props.simulation.models.map((model, index) => (
              <option key={index} value={model.simulator}>{model.name}</option>
            ))}
          </FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Signals</ControlLabel>
          {simulationModel.mapping.map((signal, index) => (
            <Checkbox key={index} checked={this.state.widget.signals.indexOf(index) !== -1} onChange={(e) => this.handleSignalChange(e, index)}>{signal.name}</Checkbox>
          ))}
        </FormGroup>
      </div>
    );
  }
}

export default EditPlotWidget;
