/**
 * File: lamp.js
 * Author: Steffen Vogel <stvogel@eonerc.rwth-aachen.de>
 * Date: 20.09.2017
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

import React, { Component } from 'react';

import EditWidgetColorControl from '../edit-widget/edit-widget-color-control';

class WidgetLamp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      threshold: 0
    };
  }

  static getDerivedStateFromProps(props, state){
    if(props.widget.signalIDs.length === 0){
      return{ value: ''};
    }

    const ic = props.icIDs[0];
    let signalID = props.widget.signalIDs[0];
    let widgetSignal = props.signals.find(sig => sig.id === signalID);

    // update value
    if (props.data == null
      || props.data[ic] == null
      || props.data[ic].output == null
      || props.data[ic].output.values == null) {
      return{value:''};
    }

    // check if value has changed
    const signalData = props.data[ic].output.values[widgetSignal.index];
    if (signalData != null && state.value !== signalData[signalData.length - 1].y) {
      return { value: signalData[signalData.length - 1].y };
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
      width:  this.props.widget.width,
      height: this.props.widget.height
    }

    return (
      <div className="lamp-widget" style={style} />
    );
  }
}

export default WidgetLamp;
