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
import { format } from "d3";
import { Table, DataColumn } from "../../../../common/table";

const WidgetTable = (props) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let newRows = [];
    let signalID, sig;
    for (signalID of props.widget.signalIDs) {
      for (sig of props.signals) {
        if (signalID === sig.id) {
          let icID = props.icIDs[sig.id];

          let direction = sig.direction === "out" ? "output" : "input";
          if (
            props.data[icID] &&
            props.data[icID][direction] &&
            props.data[icID][direction].values
          ) {
            if (props.data[icID][direction].values[sig.index] !== undefined) {
              let data = props.data[icID][direction].values[sig.index];
              newRows.push({
                name: sig.name,
                unit: sig.unit,
                value: data[data.length - 1].y * sig.scalingFactor,
                scalingFactor: sig.scalingFactor,
              });
            } else {
              newRows.push({
                name: sig.name,
                unit: sig.unit,
                value: NaN,
                scalingFactor: sig.scalingFactor,
              });
            }
          }
        }
      }
    }

    if (newRows.length === 0) {
      newRows.push({ name: "no entries" });
    }

    setRows(newRows);
  }, [props.widget.signalIDs, props.signals, props.icIDs, props.data]);

  let showScalingFactor =
    props.widget.customProperties.showScalingFactor !== undefined
      ? props.widget.customProperties.showScalingFactor
      : true;

  let columns = [
    <DataColumn key={1} title="Signal" dataKey="name" width={120} />,
    <DataColumn
      key={2}
      title="Value"
      dataKey="value"
      modifier={format(".4f")}
    />,
  ];

  let nextKey = 3;
  if (showScalingFactor) {
    columns.push(
      <DataColumn
        key={nextKey}
        title="Scale"
        dataKey="scalingFactor"
        modifier={format(".2f")}
      />
    );
    nextKey++;
  }
  if (props.widget.customProperties.showUnit) {
    columns.push(<DataColumn key={nextKey} title="Unit" dataKey="unit" />);
  }

  return (
    <div
      className="table-widget"
      style={{
        width: props.widget.width,
        height: props.widget.height,
        overflowY: "auto",
      }}
    >
      <Table data={rows}>{columns}</Table>
    </div>
  );
};

export default WidgetTable;
