/**
 * File: widget-value.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

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
    var value_to_render = Number(this.state.value);
    return (
      <div className="single-value-widget">
        <strong>{this.props.widget.name}</strong> <span>{ Number.isNaN(value_to_render)?  NaN : value_to_render.toFixed(3) } </span>
      </div>
    );
  }
}

export default WidgetValue;
