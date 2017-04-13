/**
 * File: widget-label.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 14.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';

class WidgetLabel extends Component {
  render() {
    return (
      <div className="label-widget">
        <h4>{this.props.widget.name}</h4>
      </div>
    );
  }
}

export default WidgetLabel;
