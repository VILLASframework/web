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
import { FormGroup } from 'react-bootstrap';
import Plot from '../widget-plot/plot';
import PlotLegend from '../widget-plot/plot-legend';

class WidgetPlotTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signals: [],
      data: []
    };
  }

  static getDerivedStateFromProps(props, state){
    let intersection = []
    let data = [];
    let signalID, sig;
    for (signalID of props.widget.signalIDs) {
      for (sig of props.signals) {
        if (signalID === sig.id) {
          intersection.push(sig);

          // sig is a selected signal, get data
          // determine ID of infrastructure component related to signal (via config)
          let icID = props.icIDs[sig.id]

          // distinguish between input and output signals
          if (sig.direction === "out") {
            if (props.data[icID] != null && props.data[icID].output != null && props.data[icID].output.values != null) {
              if (props.data[icID].output.values[sig.index-1] !== undefined) {
                data.push(props.data[icID].output.values[sig.index-1]);
              }
            }
          } else if (sig.direction === "in") {
            if (props.data[icID] != null && props.data[icID].input != null && props.data[icID].input.values != null) {
              if (props.data[icID].input.values[sig.index-1] !== undefined) {
                data.push(props.data[icID].input.values[sig.index-1]);
              }
            }
          }
        } // sig is selected signal
      } // loop over props.signals
    } // loop over selected signals

    return {signals: intersection, data: data}
  }

  // updateSignalSelection(signal, checked) {
  //   // Update the selected signals and propagate to parent component
  //   var new_widget = Object.assign({}, this.props.widget, {
  //     checkedSignals: checked ? this.state.signals.concat(signal) : this.state.signals.filter((idx) => idx !== signal)
  //   });
  //   this.props.onWidgetChange(new_widget);
  // }

  render() {
    let checkBoxes = [];

    let showLegend = false;
    if (this.state.signals.length > 0) {

      showLegend = true;

      // Create checkboxes using the signal indices from component config
      // checkBoxes = this.state.signals.map((signal) => {
      //   let checked = this.state.signals.indexOf(signal) > -1;
      //   let chkBxClasses = classNames({
      //     'btn': true,
      //     'btn-default': true,
      //     'active': checked
      //   });
      //   return <FormCheck key={signal.index} className={chkBxClasses} checked={checked} disabled={this.props.editing}
      //                     onChange={(e) => this.updateSignalSelection(signal, e.target.checked)}> {signal.name} </FormCheck>
      // });
    }

    return (
      <div className="plot-table-widget" ref="wrapper">
        <div className="content">
          <div className="table-plot-row">
            <div className="widget-table">
              {checkBoxes.length > 0 ? (
                <FormGroup className="btn-group-vertical">
                  {checkBoxes}
                </FormGroup>
              ) : (<small>Use edit menu to change selected signals.</small>)
              }
            </div>

            <div className="widget-plot">
              <Plot
                data={this.state.data}
                time={this.props.widget.customProperties.time}
                width={this.props.widget.width - 100}
                height={this.props.widget.height - 55}
                yMin={this.props.widget.customProperties.yMin}
                yMax={this.props.widget.customProperties.yMax}
                yUseMinMax={this.props.widget.customProperties.yUseMinMax}
                paused={this.props.paused}
                yLabel={this.props.widget.customProperties.ylabel}
              />
            </div>
          </div>
          {showLegend ? (
            <PlotLegend signals={this.state.signals}/>) : (<div></div>)
          }
        </div>
      </div>
    );
  }
}
export default WidgetPlotTable;
