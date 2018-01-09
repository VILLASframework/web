/**
 * File: widget-topology.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 08.01.2018
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

import React from 'react';
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';
import config from '../config';
import '../styles/simple-spinner.css';


// Do not show Pintura's grid
const pinturaGridStyle = {
  display: 'none'
}

// Avoid another color in the frontend
const pinturaBackingStyle = {
  fill: 'transparent'
}

// Center spinner
const spinnerContainerStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

// Topology failed message
const msgContainerStyle = Object.assign({
  backgroundColor: '#ececec'
},spinnerContainerStyle)

const failedMsgStyle = {
  fontWeight: 'bold'
}

class WidgetTopology extends React.Component {
  constructor(props) {
    super(props);
    this.svgElem = null;
    this.Viewer = null;
    
    this.state = {
      visualizationState: 'initial'
    };
  }

  componentDidMount() {
    if (this.svgElem) {
      window.cimjson.setImagePathBase(process.env.PUBLIC_URL + '/Pintura/');
      window.cimsvg.setSVG(this.svgElem); // function not available in upstream source
      window.cimview.init(this.svgElem);
      window.onMouseLeave = function() {};
      window.onMouseOver = function() {};
      window.onMouseLeave = function() {};
      window.onMouseUp = function() {};
      window.onMouseDown = function() {};
      window.onMouseMove = function() {};
    }
  }

  componentWillReceiveProps(nextProps) {
    const file = nextProps.files.find(file => file._id === nextProps.widget.file);
    // Ensure model is requested only once or a different was selected
    if (this.props.widget.file !== nextProps.widget.file || (this.state.visualizationState === 'initial' && file)) {
      this.setState({'visualizationState': 'loading' });
      if (file) {
        fetch(new Request('/' + config.publicPathBase + file.path))
        .then( response => {
          if (response.status === 200) {
            this.setState({'visualizationState': 'ready' });
            window.cimxml.clearXmlData()
            window.cimsvg.setFileCount(1);
            response.text().then( contents => window.cimsvg.loadFile(contents));
          } else {
            throw new Error('Request failed');
          }
        })
        .catch(error => {
          this.setState({'visualizationState': 'failed' });
        });
      }
    }
  }

  render() {
    var markup = null;

    switch(this.state.visualizationState) {
      case 'loading':
        markup = <div style={spinnerContainerStyle}><div className="loader" /></div>; break;
      case 'failed':
        markup = <div style={msgContainerStyle}><div style={failedMsgStyle}>Topology could not be loaded</div></div>; break;
      default:
        markup = (<div>
          <ReactSVGPanZoom
                  ref={Viewer => this.Viewer = Viewer}
                  style={{outline: "1px solid black"}}
                  detectAutoPan={false}
                  width={this.props.widget.width-2} height={this.props.widget.height-2} >
                  <svg width={this.props.widget.width} height={this.props.widget.height}>
                    <svg ref={ c => this.svgElem = c }width={this.props.widget.width} height={this.props.widget.height}>
                      <rect id="backing" style={pinturaBackingStyle} />
                      <g id="grid" style={pinturaGridStyle} />
                      <g id="diagrams"/>
                    </svg>
                  </svg>
          </ReactSVGPanZoom>
        </div>);
    }
    return markup;
  }
}

export default WidgetTopology;
