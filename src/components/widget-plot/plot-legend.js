/**
 * File: plot-legend.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 10.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';

class PlotLegend extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    var colorScale = scaleOrdinal(schemeCategory10);

    return (
      <div className="plot-legend">
        { this.props.signals.map( (signal) => 
          <div key={signal.index} className="signal-legend"><span className="legend-color" style={{ background: colorScale(signal.index) }}>&nbsp;&nbsp;</span> {signal.name} </div>)
        }
      </div>
    );
  }
}

export default PlotLegend;