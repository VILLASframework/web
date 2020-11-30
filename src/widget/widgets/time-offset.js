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
import TrafficLight from 'react-trafficlight';


class WidgetTimeOffset extends Component {
  constructor(props) {
    super(props);

    this.state = {
        timeOffset: '',
        icID: ''
    };
  }

  static getDerivedStateFromProps(props, state){

    if(typeof props.widget.customProperties.icID !== "undefined" && state.icID !== props.widget.customProperties.icID){
      return {icID: props.widget.customProperties.icID};
    }

    if (props.data == null
      || props.data[state.icID] == null
      || props.data[state.icID].output == null
      || props.data[state.icID].output.timestamp == null) {
      return {timeOffset: ''};
    }

    let serverTime = props.data[state.icID].output.timestamp;
    let localTime = Date.now();
    let absoluteOffset = Math.abs(serverTime - localTime);
    return {timeOffset: Number.parseFloat(absoluteOffset/1000).toPrecision(5)};
  }

  render() {

    return (
      <div>
        <TrafficLight
        RedOn={this.props.widget.customProperties.threshold_red <= this.state.timeOffset}
        YellowOn={(this.props.widget.customProperties.threshold_yellow <= this.state.timeOffset) && (this.state.timeOffset < this.props.widget.customProperties.threshold_red)}
        GreenOn={this.state.timeOffset < this.props.widget.customProperties.threshold_yellow}
      />
      <div>Time offset:</div>
      <strong>{this.state.timeOffset}s</strong>
      </div>
    );
  }
}

export default WidgetTimeOffset;
