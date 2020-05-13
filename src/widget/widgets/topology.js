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

import React from 'react';
import {UncontrolledReactSVGPanZoom} from 'react-svg-pan-zoom';
import config from '../../config';
import '../../styles/simple-spinner.css';
import { cimsvg } from 'libcimsvg';

// Do not show Pintura's grid
const pinturaGridStyle = {
  display: 'none'
};

// Avoid another color in the frontend
const pinturaBackingStyle = {
  fill: 'transparent'
};

// Center spinner
const spinnerContainerStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

// Topology failed message
const msgContainerStyle = Object.assign({
  backgroundColor: '#ececec'
},spinnerContainerStyle);

const msgStyle = {
  fontWeight: 'bold'
};

// Initialize functions
function attachComponentEvents() {
  window.onMouseOver = (e) => show(textSibling(e));
  window.onMouseLeave = (e) => hide(textSibling(e));
}

function textSibling(e) {
  // Find sibling text element and toggle its visibility
  let gParent = e.target.parentElement;
  return gParent.getElementsByTagName('text')[0];
}

function show(element) {
  element.style.visibility = 'inherit';
}

function hide(element) {
  element.style.visibility = 'hidden';
}

// De-initialize functions
function detachComponentEvents() {
  window.onMouseOver = null;
  window.onMouseLeave = null;
}

class WidgetTopology extends React.Component {
  constructor(props) {
    super(props);
    this.svgElem = React.createRef();
    this.Viewer = null;

    this.state = {
      dashboardState: 'initial'
    };
  }

  componentDidMount() {
    if (this.svgElem) {
      window.onMouseLeave = function() {};
      window.onMouseOver = function() {};
      window.onMouseLeave = function() {};
      window.onMouseUp = function() {};
      window.onMouseDown = function() {};
      window.onMouseMove = function() {};
    }
  }

  componentWillUnmount() {
    detachComponentEvents();
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    const file = this.props.files.find(file => file.id === this.props.widget.customProperties.file);

    // TODO the following code requires revision!
    // TODO The model file is no longer stored on the local disc (config.publicPathBase and file.path are not available!).
    // TODO It is part of the file store and needs to be taken from there.
    // Ensure model is requested only once or a different was selected
    if (prevProps.widget.customProperties.file !== this.props.widget.customProperties.file
      || (prevState.dashboardState === 'initial' && file)) {

      this.setState({dashboardState: 'loading' });
      if (file) {
        fetch(new Request('/' + config.publicPathBase + file.path))
        .then( response => {
          if (response.status === 200) {
            this.setState({dashboardState: 'ready' });
            return response.text().then( contents => {
              if (this.svgElem) {
                let cimsvgInstance = new cimsvg(this.svgElem.current);
                cimsvg.setCimsvg(cimsvgInstance);
                cimsvgInstance.setFileCount(1);
                cimsvgInstance.loadFile(contents);
                //cimsvgInstance.fit();
                attachComponentEvents();
              }
              else {
                console.error("The svgElem variable is not initialized before the attempt to create the cimsvg instance.");
              }
            });
          } else {
            throw new Error('Request failed');
          }
        })
        .catch(error => {
          console.error(error);
          this.setState({
            'dashboardState': 'show_message',
            'message': 'Topology could not be loaded.'});
        });
      }
    } else {
      // No file has been selected
      if (!this.props.widget.customProperties.file&& this.state.message !== 'Select a topology model first.') {
        this.setState({
          'dashboardState': 'show_message',
          'message': 'Select a topology model first.'});
      }
    }
  }

  render() {
    var markup = null;
    const miniatureProps = {
      miniaturePosition: "none",
    }

    const toolbarProps = {
      toolbarPosition: "none"
    }

    switch(this.state.dashboardState) {
      case 'loading':
        markup = <div style={spinnerContainerStyle}><div className="loader" /></div>; break;
      case 'show_message':
        markup = <div style={msgContainerStyle}><div style={msgStyle}>{ this.state.message }</div></div>; break;
      default:
        markup = (<div>
          <UncontrolledReactSVGPanZoom
                  ref={Viewer => this.Viewer = Viewer}
                  style={{outline: "1px solid grey"}}
                  detectAutoPan={false}
                  toolbarProps={toolbarProps}
                  miniatureProps={miniatureProps}
                  background="white"
                  tool="pan"
                  width={this.props.widget.width-2} height={this.props.widget.height-2} >
                  <svg width={this.props.widget.width} height={this.props.widget.height}>
                    <svg ref={ this.svgElem } width={this.props.widget.width} height={this.props.widget.height}>
                      <rect className="backing" style={pinturaBackingStyle} />
                      <g className="grid" style={pinturaGridStyle} />
                      <g className="diagrams"/>
                    </svg>
                  </svg>
          </UncontrolledReactSVGPanZoom>
        </div>);
    }
    return markup;
  }
}

export default WidgetTopology;
