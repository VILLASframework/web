/**
 * File: value.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
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
import { format } from 'd3';

class WidgetValue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      unit: ''
    };
  }

  static getDerivedStateFromProps(props, state){
    if(props.widget.signalIDs.length === 0){
      return null;
    }

    // TODO does the following line make sense?
    const ICid = props.icIDs[0];

    // update value
    if (props.data == null
      || props.data[ICid] == null
      || props.data[ICid].output == null
      || props.data[ICid].output.values == null) {
      return{ value: '' };
    }

    // Update unit (assuming there is exactly one signal for this widget)
    let unit = '';
    let signalID = props.widget.signalIDs[0];
    let signal = props.signals.find(sig => sig.id === signalID);
    if(signal !== undefined){
      unit = signal.unit;
    }

    // check if value has changed
    const signalData = props.data[ICid].output.values[signal.index];
    if (signalData != null && state.value !== signalData[signalData.length - 1].y) {
      return {
        value: signalData[signalData.length - 1].y,
        unit: unit,
      };
    }

  }

  render() {
    var value_to_render = Number(this.state.value);
    return (
      <div className="single-value-widget">
        <strong style={{ fontSize: this.props.widget.customProperties.textSize + 'px' }}>{this.props.widget.name}</strong>
        <span style={{ fontSize: this.props.widget.customProperties.textSize + 'px' }}>{Number.isNaN(value_to_render) ? NaN : format('.3s')(value_to_render)}</span>
        {this.props.widget.customProperties.showUnit &&
          <span style={{ fontSize: this.props.widget.customProperties.textSize + 'px' }}>[{this.state.unit}]</span>
        }
      </div>
    );
  }
}

export default WidgetValue;
