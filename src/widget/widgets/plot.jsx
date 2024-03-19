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

import React, { useState, useEffect } from "react";
import Plot from "../widget-plot/plot";
import PlotLegend from "../widget-plot/plot-legend";

const WidgetPlot = (props) => {
  const [data, setData] = useState([]);
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const intersection = [];
    const plotData = [];
    let signalID, sig;
    for (signalID of props.widget.signalIDs) {
      for (sig of props.signals) {
        if (signalID === sig.id) {
          intersection.push(sig);

          // Signal is a selected signal, get data
          let icID = props.icIDs[sig.id];
          let values = null;

          if (
            sig.direction === "out" &&
            props.data[icID]?.output?.values?.[sig.index] !== undefined
          ) {
            values = props.data[icID].output.values[sig.index];
          } else if (
            sig.direction === "in" &&
            props.data[icID]?.input?.values?.[sig.index] !== undefined
          ) {
            values = props.data[icID].input.values[sig.index];
          }

          if (values) {
            if (sig.scalingFactor !== 1) {
              values = values.map((v) => ({
                ...v,
                y: v.y * sig.scalingFactor,
              }));
            }
            plotData.push(values);
          }
        }
      }
    }

    setData(plotData);
    setSignals(intersection);
  }, [props.widget.signalIDs, props.signals, props.icIDs, props.data]);

  return (
    <div className="plot-widget">
      <div className="widget-plot">
        <Plot
          data={data}
          mode={props.widget.customProperties.mode || "auto time-scrolling"}
          height={props.widget.height - 55}
          width={props.widget.width - 20}
          time={props.widget.customProperties.time}
          samples={props.widget.customProperties.nbrSamples || 100}
          yMin={props.widget.customProperties.yMin}
          yMax={props.widget.customProperties.yMax}
          yUseMinMax={props.widget.customProperties.yUseMinMax}
          paused={props.paused}
          yLabel={props.widget.customProperties.ylabel}
          lineColors={props.widget.customProperties.lineColors}
          signalIDs={props.widget.signalIDs}
        />
      </div>
      <PlotLegend
        signals={signals}
        lineColors={props.widget.customProperties.lineColors}
        showUnit={props.widget.customProperties.showUnit}
      />
    </div>
  );
};

export default WidgetPlot;
