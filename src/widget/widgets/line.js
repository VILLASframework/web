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

class WidgetLine extends Component {
  // WidgetLine is newly created when widget props are changed and saved
  constructor(props)  {
    super(props);
    this.illustrateDuringEdit = this.illustrateDuringEdit.bind(this);

    this.state = {
      width: 0,
      height: 0,
      editing: false
    }
  }

  // needed to update the looks of the line in edit mode
   illustrateDuringEdit(newwidth, newheight) {
     this.setState({width: newwidth, height: newheight, editing: true});
   }

  render() {
    let rotation = this.props.widget.customProperties.rotation;
    let rad = rotation * (Math.PI / 180);

    // get the dimensions either from props (saved widget)
    // or from the state (widget in edit mode)
    let width = this.props.widget.width;
    let height = this.props.widget.height;

    if (this.state.editing) {
      width = this.state.width;
      height = this.state.height;
    }

    let length = width;
    rotation = Math.abs(parseInt(rotation,10));
    if(rotation % 90 === 0 && (rotation/90) % 2 === 1){
      length = height;
    }

    // calculate line coordinates (in percent)
    const x1 = width * 0.5 - 0.5 * Math.cos(rad) * length;
    const x1p = '' + Math.round(100 * x1 / width) + '%';

    const x2 = width * 0.5 + 0.5 * Math.cos(rad) * length;
    const x2p = '' + Math.round(100 * x2/width) + '%';

    const y1 = height * 0.5 + 0.5 * Math.sin(rad) * length;
    const y1p = '' + Math.round(100 * y1/height) + '%';

    const y2 = height * 0.5 - 0.5 * Math.sin(rad) * length;
    const y2p = '' + Math.round(100 * y2/height) + '%';


    const lineStyle = {
        stroke: '' +  this.props.widget.customProperties.border_color,
        strokeWidth: '' + this.props.widget.customProperties.border_width + 'px'
    };

      return <svg height="100%" width="100%">
                <line x1={x1p} x2={x2p} y1={y1p} y2={y2p} style={lineStyle}/>
              </svg>;
  }
}

export default WidgetLine;
