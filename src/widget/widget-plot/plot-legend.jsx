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

import React from "react";
import { schemeCategory10 } from "d3-scale-chromatic";

function Legend(props) {
  const { sig: signal, lineColor, index, showUnit } = props;
  const hasScalingFactor = signal.scalingFactor !== 1;
  const color =
    typeof lineColor === "undefined" ? schemeCategory10[index % 10] : lineColor;

  return (
    <li key={signal.id} className="signal-legend" style={{ color: color }}>
      <span className="signal-legend-name">{signal.name}</span>
      {showUnit && (
        <span style={{ marginLeft: "0.3em" }} className="signal-unit">
          {signal.unit}
        </span>
      )}
      {hasScalingFactor && (
        <span style={{ marginLeft: "0.3em" }} className="signal-scale">
          {signal.scalingFactor}
        </span>
      )}
    </li>
  );
}

const PlotLegend = ({ signals, lineColors, showUnit }) => {
  return (
    <div className="plot-legend">
      <ul>
        {signals.map((signal, idx) => (
          <Legend
            key={signal.id}
            sig={signal}
            showUnit={showUnit}
            index={idx}
            lineColor={lineColors ? lineColors[idx] : undefined}
          />
        ))}
      </ul>
    </div>
  );
};

export default PlotLegend;
