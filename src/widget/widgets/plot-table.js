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
import classNames from 'classnames';
import { FormGroup, FormCheck } from 'react-bootstrap';

import Plot from '../widget-plot/plot';
import PlotLegend from '../widget-plot/plot-legend';

class WidgetPlotTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signals: []
    };
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    // Identify if there was a change in the selected signals
    if (JSON.stringify(prevProps.widget.signalIDs) !== JSON.stringify(this.props.widget.signalIDs)
      || this.state.signals.length === 0) {
      // Update the currently selected signals
      let intersection = []
      let signalID, sig;
      for (signalID of this.props.widget.signalIDs) {
        for (sig of this.props.signals) {
          if (signalID === sig.id) {
            intersection.push(sig);
          }
        }
      }

      this.setState({signals: intersection});
    }
  }

  updateSignalSelection(signal_index, checked) {
    // Update the selected signals and propagate to parent component
    var new_widget = Object.assign({}, this.props.widget, {
      signals: checked ? this.state.signals.concat(signal_index) : this.state.signals.filter((idx) => idx !== signal_index)
    });
    this.props.onWidgetChange(new_widget);
  }

  render() {

    let checkBoxes = [];
    let icData = [];
    let legendSignals = [];
    let showLegend = false;

    if (this.state.signals.length > 0) {

      showLegend = true;

      // get data of preselected signals
      let signal;
      for (signal of this.state.signals) {

        // determine ID of infrastructure component related to signal (via config)
        let icID = this.props.icIDs[signal.id]

        if (this.props.data[icID] != null && this.props.data[icID].output != null && this.props.data[icID].output.values != null) {
          if (this.props.data[icID].output.values[signal.index] !== undefined){
            icData.push(this.props.data[icID].output.values[signal.index]);
          }
        }
      }

      // Create checkboxes using the signal indices from component config
      checkBoxes = this.state.signals.map((signal) => {
        let checked = this.state.signals.indexOf(signal.index) > -1;
        let chkBxClasses = classNames({
          'btn': true,
          'btn-default': true,
          'active': checked
        });
        return <FormCheck key={signal.index} className={chkBxClasses} checked={checked} disabled={this.props.editing}
                          onChange={(e) => this.updateSignalSelection(signal.index, e.target.checked)}> {signal.name} </FormCheck>
      });
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
              ) : (<small>No signal has been pre-selected.</small>)
              }
            </div>

            <div className="widget-plot">
              <Plot
                data={icData}
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
