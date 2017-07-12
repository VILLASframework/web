/**
 * File: widget-gauge.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 31.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Gauge } from 'gaugeJS';

class WidgetGauge extends Component {
  constructor(props) {
    super(props);

    this.gaugeCanvas = null;
    this.gauge = null;

    this.state = {
      value: 0
    };
  }

  staticLabels(widget_height) {
    let label_font_size = Math.floor(widget_height * 0.055); // font scaling factor, integer for performance
    return {
          font: label_font_size + 'px "Helvetica Neue"',
          labels: [0.0, 0.1, 0.5, 0.9, 1.0],
          color: "#000000",
          fractionDigits: 1
        }
  }

  computeGaugeOptions(widget_height) {
    return {
        angle: -0.25,
        lineWidth: 0.2,
        pointer: {
            length: 0.6,
            strokeWidth: 0.035
        },
        radiusScale: 0.9,
        colorStart: '#6EA2B0',
        colorStop: '#6EA2B0',
        strokeColor: '#E0E0E0',
        highDpiSupport: true,
        staticLabels: this.staticLabels(widget_height)
      };
  }

  componentDidMount() {
    const opts = this.computeGaugeOptions(this.props.widget.height);
    this.gauge = new Gauge(this.gaugeCanvas).setOptions(opts);
    this.gauge.maxValue = 1;
    this.gauge.setMinValue(0);
    this.gauge.animationSpeed = 30;
    this.gauge.set(this.state.value);
  }

  shouldComponentUpdate(nextProps, nextState) {

    // Check if size changed, resize labels if it did (the canvas itself is scaled with css)
    if (this.props.widget.height !== nextProps.widget.height) {
      this.updateAfterResize(nextProps.widget.height);
    }

    // signal component update only if the value changed
    return this.state.value !== nextState.value;
  }

  componentWillReceiveProps(nextProps) {
    // update value
    const simulator = nextProps.widget.simulator;

    if (nextProps.data == null || nextProps.data[simulator.node][simulator.simulator] == null || nextProps.data[simulator.node][simulator.simulator].values == null) {
      this.setState({ value: 0 });
      return;
    }

    // check if value has changed
    const signal = nextProps.data[simulator.node][simulator.simulator].values[nextProps.widget.signal];
    // Take just 3 decimal positions
    // Note: Favor this method over Number.toFixed(n) in order to avoid a type conversion, since it returns a String
    if (signal != null) {
      const new_value = Math.round( signal[signal.length - 1].y * 1e3 ) / 1e3;
      if (this.state.value !== new_value) {
        this.setState({ value: new_value });

        // update gauge's value
        this.gauge.set(new_value);
      }
    }
  }

  updateAfterResize(newHeight) {
    // Update labels after resize
    this.gauge.setOptions({ staticLabels: this.staticLabels(newHeight) });
  }

  render() {
    var componentClass = this.props.editing ? "gauge-widget editing" : "gauge-widget";
    var signalType = null;

    if (this.props.simulation) {
      var simulationModel = this.props.simulation.models.filter((model) => model.simulator.node === this.props.widget.simulator.node && model.simulator.simulator === this.props.widget.simulator.simulator)[0];
      signalType = (simulationModel != null && simulationModel.length > 0) ? simulationModel.mapping[this.props.widget.signal].type : '';
    }

    return (
      <div className={ componentClass }>
          <div className="gauge-name">{ this.props.widget.name }</div>
          <canvas ref={ (node) => this.gaugeCanvas = node } />
          <div className="gauge-unit">{ signalType }</div>
          <div className="gauge-value">{ this.state.value }</div>
      </div>
    );
  }
}

export default WidgetGauge;
