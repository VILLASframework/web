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

import React, { Component } from 'react';
import { format } from 'd3';

import Table from '../../common/table';
import TableColumn from '../../common/table-column';

class WidgetTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
    };
  }

  static getDerivedStateFromProps(props, state){

    let rows = [];
    let signalID, sig;
    for (signalID of props.widget.signalIDs) {
      for (sig of props.signals) {
        if (signalID === sig.id) {
          // sig is a selected signal, get data
          // determine ID of infrastructure component related to signal (via config)
          let icID = props.icIDs[sig.id]

          let signalName = sig.name;
          if(sig.scalingFactor !== 1.0){
            signalName = signalName + "(x" + String(sig.scalingFactor) + ")";
          }

          // distinguish between input and output signals
          if (sig.direction === "out") {
            if (props.data[icID] != null && props.data[icID].output != null && props.data[icID].output.values != null) {
              if (props.data[icID].output.values[sig.index-1] !== undefined) {
                let data = props.data[icID].output.values[sig.index-1];
                rows.push({
                  name: signalName,
                  unit: sig.unit,
                  value: data[data.length - 1].y * sig.scalingFactor
                });

              }
            }
          } else if (sig.direction === "in") {
            if (props.data[icID] != null && props.data[icID].input != null && props.data[icID].input.values != null) {
              if (props.data[icID].input.values[sig.index-1] !== undefined) {
                let data = props.data[icID].input.values[sig.index-1];
                rows.push({
                  name: signalName,
                  unit: sig.unit,
                  value: data[data.length - 1].y * sig.scalingFactor
                });
              }
            }
          }
        } // sig is selected signal
      } // loop over props.signals
    } // loop over selected signals

    return {rows: rows}

  }

  render() {

    let rows = this.state.rows;

    if(rows.length === 0){
      rows.push({
        name: "no entries"
      })
    }

    var columns = [
      <TableColumn key={1} title="Signal" dataKey="name" width={120} />,
      <TableColumn key={2} title="Value" dataKey="value" modifier={format('.4f')} />
    ];

    if (this.props.widget.customProperties.showUnit)
      columns.push(<TableColumn key={3} title="Unit" dataKey="unit" />)

    return (
      <div className="table-widget" style={{width: this.props.widget.width, height: this.props.widget.height, overflowY: 'auto'}}>
        <Table data={rows}>
          { columns }
        </Table>
      </div>
    );
  }
}

export default WidgetTable;
