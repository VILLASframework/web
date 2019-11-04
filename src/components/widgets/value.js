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

  componentWillReceiveProps(nextProps) {
    if (nextProps.simulationModel == null) {
      this.setState({ value: '' });
      return;
    }

    const simulator = nextProps.simulationModel.simulator;

    // update value
    if (nextProps.data == null || nextProps.data[simulator] == null || nextProps.data[simulator].output == null || nextProps.data[simulator].output.values == null) {
      this.setState({ value: '' });
      return;
    }

    const unit = nextProps.simulationModel.outputMapping[nextProps.widget.signal].type;

    // check if value has changed
    const signal = nextProps.data[simulator].output.values[nextProps.widget.signal];
    if (signal != null && this.state.value !== signal[signal.length - 1].y) {
      this.setState({ value: signal[signal.length - 1].y, unit });
    }
  }

  render() {
    var value_to_render = Number(this.state.value);
    return (
      <div className="single-value-widget">
        <strong style={{ fontSize: this.props.widget.textSize + 'px' }}>{this.props.widget.name}</strong>
        <span style={{ fontSize: this.props.widget.textSize + 'px' }}>{Number.isNaN(value_to_render) ? NaN : format('.3s')(value_to_render)}</span>
        {this.props.widget.showUnit &&
          <span style={{ fontSize: this.props.widget.textSize + 'px' }}>[{this.state.unit}]</span>
        }
      </div>
    );
  }
}

export default WidgetValue;
