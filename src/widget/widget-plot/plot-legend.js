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

import React from 'react';
import { scaleOrdinal} from 'd3-scale';
import {schemeCategory10} from 'd3-scale-chromatic'

function Legend(props){
  const signal = props.sig;
  const hasScalingFactor = (signal.scalingFactor !== 1);


  if(hasScalingFactor){
    return (
      <li key={signal.id} className="signal-legend" style={{ color: props.colorScale(signal.id) }}>
      <span className="signal-legend-name">{signal.name}</span>
      <span style={{ marginLeft: '0.3em' }} className="signal-unit">{signal.unit}</span>
      <span style={{ marginLeft: '0.3em' }} className="signal-scale">{signal.scalingFactor}</span>
      </li>
    )
  } else {
    return (
      <li key={signal.id} className="signal-legend" style={{ color: props.colorScale(signal.id) }}>
        <span className="signal-legend-name">{signal.name}</span>
        <span style={{ marginLeft: '0.3em' }} className="signal-unit">{signal.unit}</span>
      </li>
    )
  }

}

class PlotLegend extends React.Component {
  render() {
    const colorScale = scaleOrdinal(schemeCategory10);

    return <div className="plot-legend">
      <ul>
        {
          this.props.signals.map( signal =>
             <Legend key={signal.id} sig={signal} colorScale={colorScale}/>
        )}
      </ul>
    </div>;
  }
}

export default PlotLegend;
