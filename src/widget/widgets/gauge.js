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

import React, { Component } from 'react';
import { Gauge } from 'gaugeJS';
//import {update} from "immutable";

class WidgetGauge extends Component {
  constructor(props) {
    super(props);

    this.gaugeCanvas = null;
    this.gauge = null;

    this.state = {
      value: 0,
      unit: '',
      signalID: '',
      minValue: null,
      maxValue: null,
      colorZones: [],
      useMinMax: false,
      useMinMaxChange: false,
    };
  }

  componentDidMount() {
    this.gauge = new Gauge(this.gaugeCanvas).setOptions(this.computeGaugeOptions(this.props.widget));
    this.gauge.maxValue = this.state.maxValue;
    this.gauge.setMinValue(this.state.minValue);
    this.gauge.animationSpeed = 30;
    this.gauge.set(this.state.value);

    this.updateLabels(this.state.minValue, this.state.maxValue);
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {

    // update gauge's value
    if(prevState.value !== this.state.value){
      this.gauge.set(this.state.value)
    }

    if(prevState.useMinMax === true && this.state.useMinMax === false){
      this.setState({useMinMaxChange: true});
    }

    // update labels
    if(prevState.minValue !== this.state.minValue || prevState.maxValue !== this.state.maxValue || prevState.colorZones !== this.state.colorZones
      || prevState.useMinMax !== this.state.useMinMax || prevState.signalID !== this.state.signalID){
        this.gauge = new Gauge(this.gaugeCanvas).setOptions(this.computeGaugeOptions(this.props.widget));
        this.gauge.maxValue = this.state.maxValue;
        this.gauge.setMinValue(this.state.minValue);
        this.gauge.animationSpeed = 30;
        this.gauge.set(this.state.value);
        this.updateLabels(this.state.minValue, this.state.maxValue)
    }

  }

  static getDerivedStateFromProps(props, state){

    if(props.widget.signalIDs.length === 0){
      return{ value: 0, minValue: 0, maxValue: 10};
    }

    // get the signal with the selected signal ID
    let signalID = props.widget.signalIDs[0];
    let signal = props.signals.filter(s => s.id === signalID)

    if(signal.length > 0) {
      // determine ID of infrastructure component related to signal[0] (there is only one signal for a lamp widget)
      let icID = props.icIDs[signal[0].id];

      let returnState = {}

      returnState["colorZones"] = props.widget.customProperties.zones;

      if (signalID) {
        returnState["signalID"] = signalID;
      }
      // Update unit (assuming there is exactly one signal for this widget)
      if (signal !== undefined) {
        returnState["unit"] = signal[0].unit;
      }

      // update value

      // check if data available
      if (props.data == null
        || props.data[icID] == null
        || props.data[icID].output == null
        || props.data[icID].output.values == null) {
        return {value: 0, minValue: 0, maxValue: 10};
      }

      // memorize if min or max value is updated
      let updateValue = false;
      let updateMinValue = false;
      let updateMaxValue = false;

      // check if value has changed
      const data = props.data[icID].output.values[signal[0].index - 1];
      // Take just 3 decimal positions
      // Note: Favor this method over Number.toFixed(n) in order to avoid a type conversion, since it returns a String
      if (data != null) {
        const value = signal[0].scalingFactor * Math.round(data[data.length - 1].y * 1e3) / 1e3;
        let minValue = null;
        let maxValue = null;

        if ((state.value !== value && value != null) || props.widget.customProperties.valueUseMinMax || state.useMinMaxChange) {
          //value has changed
          updateValue = true;

          // update min-max if needed
          let updateLabels = false;

          minValue = state.minValue;
          maxValue = state.maxValue;

          if (minValue == null || (!props.widget.customProperties.valueUseMinMax && (value < minValue || signalID !== state.signalID)) || state.useMinMaxChange) {
            minValue = value - 0.5;
            updateLabels = true;
            updateMinValue = true;
          }

          if (maxValue == null || (!props.widget.customProperties.valueUseMinMax && (value > maxValue || signalID !== state.signalID)) || state.useMinMaxChange) {
            maxValue = value + 0.5;
            updateLabels = true;
            updateMaxValue = true;
            returnState["useMinMaxChange"] = false;
          }

          if (props.widget.customProperties.valueUseMinMax) {
            minValue = props.widget.customProperties.valueMin;
            updateMinValue = true;
            maxValue = props.widget.customProperties.valueMax;
            updateMaxValue = true;
            updateLabels = true;

          }

          if (updateLabels === false && state.gauge) {
            // check if min/max changed
            if (minValue > state.gauge.minValue) {
              minValue = state.gauge.minValue;
              updateMinValue = true;
            }

            if (maxValue < state.gauge.maxValue) {
              maxValue = state.gauge.maxValue;
              updateMaxValue = true;
            }
          }
        }

        if (props.widget.customProperties.valueUseMinMax !== state.useMinMax) {
          returnState["useMinMax"] = props.widget.customProperties.valueUseMinMax;
        }

        // prepare returned state
        if (updateValue === true) {
          returnState["value"] = value;
        }
        if (updateMinValue === true) {
          returnState["minValue"] = minValue;
        }
        if (updateMaxValue === true) {
          returnState["maxValue"] = maxValue;
        }

        if (returnState !== {}) {
          return returnState;
        } else {
          return null;
        }
      } // if there is signal data
    }
    return null;

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
    let zones = this.props.widget.customProperties.colorZones ? this.props.widget.customProperties.zones : null;
    if (zones != null) {
      // adapt range 0-100 to actual min-max
      const step = (maxValue - minValue) / 100;

      zones = zones.map(zone => {
        return Object.assign({}, zone, { min: (zone.min * step) + +minValue, max: zone.max * step + +minValue, strokeStyle: '#' + zone.strokeStyle });
      });
    }

    if(this.state.signalID !== ''){
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
      limitMax: widget.customProperties.valueUseMinMax || false,
      limitMin: widget.customProperties.valueUseMinMax || false
    };
  }

  render() {
    const componentClass = this.props.editing ? "gauge-widget editing" : "gauge-widget";

    return (
      <div className={componentClass}>
          <div className="gauge-name">{this.props.widget.name}</div>
          <canvas ref={node => this.gaugeCanvas = node} />
          <div className="gauge-unit">{this.state.unit}</div>
          <div className="gauge-value">{this.state.value}</div>
      </div>
    );
  }
}

export default WidgetGauge;
