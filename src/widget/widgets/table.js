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
      sequence: null,
      showUnit: false
    };
  }


  static getDerivedStateFromProps(props, state){

    if(props.widget.signalIDs.length === 0){
      return{
        rows: [],
        sequence: null,
      };
    }


    const ICid = props.icIDs[0];
    let widgetSignals = props.signals.find(sig => {
      for (let id of props.widget.signalIDs){
        if (id === sig.id){
          return true;
        }
      }
      return false;
    });

    // check data
    if (props.data == null
      || props.data[ICid] == null
      || props.data[ICid].output == null
      || props.data[ICid].output.values.length === 0
      || props.data[ICid].output.values[0].length === 0) {

      // clear values
      return{
        rows: [],
        sequence: null,
        showUnit: false,
      };
    }

    // get rows
    const rows = [];

    props.data[ICid].output.values.forEach((signal, index) => {
      let s = widgetSignals.find( sig => sig.index === index);
      // if the signal is used by the widget
      if (s !== undefined) {
        // push data of the signal
        rows.push({
          name: s.name,
          unit: s.unit,
          value: signal[signal.length - 1].y
        });
      }
    });

    return {
      showUnit: props.showUnit,
      rows: rows,
      sequence: props.data[ICid].output.sequence
    };
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
      <TableColumn key={2} title="Value" dataKey="value" modifier={format('.4s')} />
    ];

    if (this.props.widget.customProperties.showUnit)
      columns.push(<TableColumn key={3} title="Unit" dataKey="unit" />)

    return (
      <div className="table-widget">
        <Table data={rows}>
          { columns }
        </Table>
      </div>
    );
  }
}

export default WidgetTable;
