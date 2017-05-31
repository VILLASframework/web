/**
 * File: widget-box.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 25.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';

import EditWidgetColorControl from './dialog/edit-widget-color-control';

class WidgetBox extends Component {
  render() {
    
    let colors = EditWidgetColorControl.ColorPalette;

    let colorStyle = {
      borderColor: colors[this.props.widget.border_color]
    }

    return (
      <div className="box-widget full">
        <div className="border" style={colorStyle}>
          {  }
        </div>
      </div>
    );
  }
}

export default WidgetBox;
