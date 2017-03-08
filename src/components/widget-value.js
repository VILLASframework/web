/**
 * File: widget-value.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';

//import EditWidgetValueDialog from './dialog-edit-widget-value';

class WidgetValue extends Component {
  render() {
    // calculate value
    var value = null;
    const identifier = '58bfd9facd76830327c8b6d4';
    const signal = 2;

    if (this.props.data && this.props.data[identifier] && this.props.data[identifier].values) {
      const signalArray = this.props.data[identifier].values[signal];
      value = signalArray[signalArray.length - 1].y;
    }

    return (
      <div>
        {this.props.widget.name}: {value}
      </div>
    );
  }
}

export default WidgetValue;
