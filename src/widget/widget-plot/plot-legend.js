/**
 * File: plot-legend.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 10.04.2017
 * Copyright: 2018, Institute for Automation of Complex Power Systems, EONERC
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

import React from 'react';
import { scaleOrdinal} from 'd3-scale';
import {schemeCategory10} from 'd3-scale-chromatic'

class PlotLegend extends React.Component {
  render() {
    const colorScale = scaleOrdinal(schemeCategory10);

    return <div className="plot-legend">
      <ul>
        {this.props.signals.map(signal =>
          <li key={signal.index} className="signal-legend" style={{ color: colorScale(signal.index) }}>
            <span className="signal-legend-name">{signal.name}</span>
            <span style={{ marginLeft: '0.3em' }} className="signal-unit">{signal.unit}</span>
          </li>
        )}
      </ul>
    </div>;
  }
}

export default PlotLegend;
