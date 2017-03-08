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
  render() {
    // calculate value
    var value = null;
    const widget = this.props.widget;

    if (this.props.data && this.props.data[widget.simulator] && this.props.data[widget.simulator].values) {
      const signalArray = this.props.data[widget.simulator].values[widget.signal];
      value = signalArray[signalArray.length - 1].y;
    }

    return (
      <div>
        {widget.name}: {value}
      </div>
    );
  }
}

export default WidgetValue;
