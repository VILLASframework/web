/**
 * File: widget-value.js
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

class WidgetValue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    // update value
    const simulator = nextProps.widget.simulator;

    if (nextProps.data == null || nextProps.data[simulator] == null || nextProps.data[simulator].values == null) {
      this.setState({ value: '' });
      return;
    }

    // check if value has changed
    const signal = nextProps.data[simulator].values[nextProps.widget.signal];
    if (this.state.value !== signal[signal.length - 1].y) {
      this.setState({ value: signal[signal.length - 1].y });
    }
  }

  render() {
    return (
      <div>
        {this.props.widget.name}: {this.state.value}
      </div>
    );
  }
}

export default WidgetValue;
