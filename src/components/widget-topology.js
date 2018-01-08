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

const pinturaGridStyle = {
  display: 'none'
}

const pinturaBackingStyle = {
  fill: 'transparent'
}

class WidgetTopology extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
    this.svgElem = null;
    this.Viewer = null;
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

  fileReader(e) {
    let files = e.target.files;
    if (files) {
        window.cimxml.clearXmlData()
        window.cimsvg.setFileCount(files.length);
        for (var i=0, f; i < files.length; i++) {
          f=files[i];
          if (!f) {
              return;
          }
          var reader = new FileReader();
              reader.onload = function(e) {
              var contents = e.target.result;
              window.cimsvg.loadFile(contents);
          };
          reader.readAsText(f);
        }
    }
  }

  render() {

    let svgLabelStyles = {
      'fontSize': '10pt',
      'fill': 'white'
    }

    return (<div>
    <input id="fileopen" ref={ c => this.input = c} type="file"  multiple="true" onChange={ e => this.fileReader(e)} />
    <ReactSVGPanZoom
            ref={Viewer => this.Viewer = Viewer}
            style={{outline: "1px solid black"}}
            detectAutoPan={false}
            width={this.props.widget.width-2} height={this.props.widget.height-2}
            onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
            onMouseMove={event => console.log('move', event.x, event.y)} >
            <svg width={this.props.widget.width} height={this.props.widget.height}>
              <svg ref={ c => this.svgElem = c }width={this.props.widget.width} height={this.props.widget.height}>
                <rect id="backing" style={pinturaBackingStyle} />
                <g id="grid" style={pinturaGridStyle} />
                <g id="diagrams"/>
                <g>
                    <rect id="testbutton" onClick={ e => console.log('I (%o) was clicked!') }  x="2" y="6" width="70" height="20" />
                    <text className="svglabel-high" style={svgLabelStyles} x="8" y="20">Click Me!</text>
                </g>
              </svg>
            </svg>
    </ReactSVGPanZoom>
    </div>);
  }
}

export default WidgetTopology;
