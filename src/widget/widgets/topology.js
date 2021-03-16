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
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';
import '../../styles/simple-spinner.css';
import { cimsvg } from 'libcimsvg';
import AppDispatcher from "../../common/app-dispatcher";

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
  if(element !== undefined) {
    element.style.visibility = 'inherit';
  }
}

function hide(element) {
  if (element !== undefined) {
    element.style.visibility = 'hidden';
  }
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
      file: this.props.files.find(file => file.id === parseInt(this.props.widget.customProperties.file, 10)),
      dashboardState: 'initial',
      message: ''
    };
  }

  static getDerivedStateFromProps(props, state){
    // Find the selected file of the widget, is undefined if no file is selected
    let file = props.files.find(file => file.id === parseInt(props.widget.customProperties.file, 10));

    let dashboardState = state.dashboardState;
    let message = state.message;

    if(file === undefined){
      dashboardState = 'show_message';
      message = 'Select a topology model.'
    } else if (!file.hasOwnProperty('data') && dashboardState === 'show_message'){
      // Data of file is missing, start download
      dashboardState = 'loading';
      message = '';
      AppDispatcher.dispatch({
        type: 'files/start-download',
        data: file.id,
        token: props.token
      });
    } else if (file.hasOwnProperty('data') && (dashboardState === 'loading'|| dashboardState === 'show_message')){
      // File is available set state to ready
      dashboardState = 'ready'
      message = '';
    }

    return{
      file: file,
      dashboardState:dashboardState,
      message: message,
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

    // Query the file referenced by the widget (if any)
    if (this.state.file !== undefined) {
      this.setState({dashboardState: 'loading'});
      AppDispatcher.dispatch({
        type: 'files/start-download',
        data: this.state.file.id,
        token: this.props.token
      });
    }
  }

  componentWillUnmount() {
    detachComponentEvents();
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {

    if(this.state.dashboardState === 'ready'){
      // Topology file incl data downloaded, init SVG (should happen only once!)
      if (this.svgElem) {
        let cimsvgInstance = new cimsvg(this.svgElem.current);
        cimsvg.setCimsvg(cimsvgInstance);
        cimsvgInstance.setFileCount(1);
        // transform data blob into string format
        this.state.file.data.text().then(function(content) {
          cimsvgInstance.loadFile(content);
          cimsvgInstance.fit();
          attachComponentEvents();
        });
        this.setState({dashboardState: 'loaded'});
      }
      else {
        console.error("The svgElem variable is not initialized before the attempt to create the cimsvg instance.");
      }

    }
  }

  render() {

    var markup = null;
    const miniatureProps = {
      position: "none",
    }

    const toolbarProps = {
      position: "right"
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
            background={"white"}
            width={this.props.widget.width-2}
            height={this.props.widget.height-2} >
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
