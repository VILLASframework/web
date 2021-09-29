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
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class WidgetTimeOffset extends Component {
  constructor(props) {
    super(props);

    this.state = {
        timeOffset: '',
        icID: '',
        icName: '',
        websocketOpen: false
    };
  }

  static getDerivedStateFromProps(props, state){

    if(typeof props.widget.customProperties.icID !== "undefined" && state.icID !== props.widget.customProperties.icID){
      return {icID: props.widget.customProperties.icID};
    }

    let ic = props.ics.find(ic => ic.id === parseInt(state.icID, 10));
    let websocket = props.websockets.find(ws => ws.url === ic.websocketurl);

    if (props.data == null
      || props.data[state.icID] == null
      || props.data[state.icID].output == null
      || props.data[state.icID].output.timestamp == null) {
      if (websocket) { return {timeOffset: -1, websocketOpen: websocket.connected};}
      return {timeOffset: -1};
    }

    let serverTime = props.data[state.icID].output.timestamp;
    let localTime = Date.now();
    let absoluteOffset = Math.abs(serverTime - localTime);

    if(typeof websocket === 'undefined'){
      return {timeOffset: Number.parseFloat(absoluteOffset/1000).toPrecision(5)}
    }
    return {timeOffset: Number.parseFloat(absoluteOffset/1000).toPrecision(5), websocketOpen: websocket.connected, icName: ic.name};
  }

  render() {

    let icSelected = " ";
    if(!this.state.websocketOpen){
      icSelected = "no connection";
    } else if (this.state.websocketOpen && this.state.timeOffset < 0) {
      icSelected = "no/invalid data";
    } else if (this.props.widget.customProperties.showOffset){
      icSelected = this.state.timeOffset + 's';
    }
    return (
      <div className="time-offset">
      {this.props.widget.customProperties.icID !== -1 ?
      (<span></span>) : (<span>no IC</span>)
      }
      {this.props.widget.customProperties.icID !== -1 && this.props.widget.customProperties.showName ?
      (<span>{this.state.icName}</span>) : (<span></span>)
      }
      <OverlayTrigger key={0} placement={'left'} overlay={<Tooltip id={`tooltip-${"traffic-light"}`}>
      {this.props.widget.customProperties.icID !== -1 ?
      (<span>{this.state.icName}<br></br>Offset: {this.state.timeOffset + "s"}</span>)
      :
      (<span>Please select Infrastructure Component</span>)}
      </Tooltip>}>
        <TrafficLight Horizontal={this.props.widget.customProperties.horizontal} width={this.props.widget.width - 40} height={this.props.widget.height - 40}
        RedOn={(this.props.widget.customProperties.threshold_red <= this.state.timeOffset) || !this.state.websocketOpen || (this.state.timeOffset < 0)}
        YellowOn={(this.props.widget.customProperties.threshold_yellow <= this.state.timeOffset) && (this.state.timeOffset < this.props.widget.customProperties.threshold_red) && this.state.websocketOpen}
        GreenOn={(this.state.timeOffset > 0) && (this.state.timeOffset < this.props.widget.customProperties.threshold_yellow) && this.state.websocketOpen}
      />
      </OverlayTrigger>
      {this.props.widget.customProperties.icID !== -1 ?
      (
      <span>{icSelected}</span>)
      :
      (<span>selected</span>)
      }
      </div>
    );
  }
}

export default WidgetTimeOffset;
