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

import EditWidgetColorControl from '../edit-widget/edit-widget-color-control';

class WidgetLamp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  static getDerivedStateFromProps(props, state){
    if(props.widget.signalIDs.length === 0){
      return{ value: ''};
    }

    // get the signal with the selected signal ID
    let signalID = props.widget.signalIDs[0];
    let signal = props.signals.filter(s => s.id === signalID)
    // determine ID of infrastructure component related to signal[0] (there is only one signal for a lamp widget)
    let icID = props.icIDs[signal[0].id];

    // check if data available
    if (props.data == null
      || props.data[icID] == null
      || props.data[icID].output == null
      || props.data[icID].output.values == null) {
      return{value:''};
    }

    // check if value has changed
    const data = props.data[icID].output.values[signal[0].index-1];
    if (data != null && Number(state.value) !== signal[0].scalingFactor * data[data.length - 1].y) {
      return { value: signal[0].scalingFactor * data[data.length - 1].y };
    }

    return null;
  }

  render() {

    let colors = EditWidgetColorControl.ColorPalette;
    let color;

    if (Number(this.state.value) > Number(this.props.widget.customProperties.threshold))
      color = colors[this.props.widget.customProperties.on_color];
    else
      color = colors[this.props.widget.customProperties.off_color];

    let style = {
      backgroundColor: color,
    }

    return (
      <div className="lamp-widget" style={style} />
    );
  }
}

export default WidgetLamp;
