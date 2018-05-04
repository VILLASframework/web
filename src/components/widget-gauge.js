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
      value: 0,
      minValue: null,
      maxValue: null
    };
  }

  componentDidMount() {
    this.gauge = new Gauge(this.gaugeCanvas).setOptions(this.computeGaugeOptions(this.props.widget));
    //this.gauge.maxValue = this.state.maxValue;
    //this.gauge.setMinValue(this.state.minValue);
    this.gauge.animationSpeed = 30;
    //this.gauge.set(this.state.value);

    //this.updateLabels(this.state.minValue, this.state.maxValue);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.simulationModel == null) {
      this.setState({ value: 0 });
      return;
    }

    const simulator = nextProps.simulationModel.simulator;
    
    // update value
    if (nextProps.data == null || nextProps.data[simulator] == null
      || nextProps.data[simulator].output == null
      || nextProps.data[simulator].output.values == null
      || nextProps.data[simulator].output.values.length === 0  
      || nextProps.data[simulator].output.values[0].length === 0) {
      this.setState({ value: 0 });
      return;
    }

    // check if value has changed
    const signal = nextProps.data[simulator].output.values[nextProps.widget.signal];
    // Take just 3 decimal positions
    // Note: Favor this method over Number.toFixed(n) in order to avoid a type conversion, since it returns a String
    if (signal != null) {
      const value = Math.round(signal[signal.length - 1].y * 1e3) / 1e3;
      if (this.state.value !== value && value != null) {
        this.setState({ value });

        // update min-max if needed
        let updateLabels = false;
        let minValue = this.state.minValue;
        let maxValue = this.state.maxValue;

        if (minValue == null) {
          minValue = value - 0.5;
          updateLabels = true;

          this.setState({ minValue });
          this.gauge.setMinValue(minValue);
        }

        if (maxValue == null) {
          maxValue = value + 0.5;
          updateLabels = true;

          this.setState({ maxValue });
          this.gauge.maxValue = maxValue;
        }

        if (nextProps.widget.valueUseMinMax) {
          if (this.state.minValue > nextProps.widget.valueMin) {
            minValue = nextProps.widget.valueMin;

            this.setState({ minValue });
            this.gauge.setMinValue(minValue);

            updateLabels = true;
          }

          if (this.state.maxValue < nextProps.widget.valueMax) {
            maxValue = nextProps.widget.valueMax;

            this.setState({ maxValue });
            this.gauge.maxValue = maxValue;

            updateLabels = true;
          }
        }

        if (updateLabels === false) {
          // check if min/max changed
          if (minValue > this.gauge.minValue) {
            minValue = this.gauge.minValue;
            updateLabels = true;

            this.setState({ minValue });
          }

          if (maxValue < this.gauge.maxValue) {
            maxValue = this.gauge.maxValue;
            updateLabels = true;

            this.setState({ maxValue });
          }
        }

        if (updateLabels) {
          this.updateLabels(minValue, maxValue);
        }

        // update gauge's value
        this.gauge.set(value);
      }
    }
  }

  updateLabels(minValue, maxValue, force) {
    // calculate labels
    const labels = [];
    const labelCount = 5;
    const labelStep = (maxValue - minValue) / (labelCount - 1);

    for (let i = 0; i < labelCount; i++) {
      labels.push(minValue + labelStep * i);
    }

    // calculate zones
    let zones = this.props.widget.colorZones ? this.props.widget.zones : null;
    if (zones != null) {
      // adapt range 0-100 to actual min-max
      const step = (maxValue - minValue) / 100;

      zones = zones.map(zone => {
        return Object.assign({}, zone, { min: (zone.min * step) + +minValue, max: zone.max * step + +minValue, strokeStyle: '#' + zone.strokeStyle });
      });
    }

    this.gauge.setOptions({ 
      staticLabels: {
        font: '10px "Helvetica Neue"',
        labels,
        color: "#000000",
        fractionDigits: 1
      },
      staticZones: zones
    });
  }

  computeGaugeOptions(widget) {
    return {
      angle: -0.25,
      lineWidth: 0.2,
      pointer: {
          length: 0.6,
          strokeWidth: 0.035
      },
      radiusScale: 0.8,
      colorStart: '#6EA2B0',
      colorStop: '#6EA2B0',
      strokeColor: '#E0E0E0',
      highDpiSupport: true,
      limitMax: false,
      limitMin: false
    };
  }

  render() {
    const componentClass = this.props.editing ? "gauge-widget editing" : "gauge-widget";
    let signalType = null;

    if (this.props.simulationModel != null) {
      signalType = (this.props.simulationModel != null && this.props.simulationModel.outputLength > 0 && this.props.widget.signal < this.props.simulationModel.outputLength) ? this.props.simulationModel.outputMapping[this.props.widget.signal].type : '';
    }

    return (
      <div className={componentClass}>
          <div className="gauge-name">{this.props.widget.name}</div>
          <canvas ref={node => this.gaugeCanvas = node} />
          <div className="gauge-unit">{signalType}</div>
          <div className="gauge-value">{this.state.value}</div>
      </div>
    );
  }
}

export default WidgetGauge;
