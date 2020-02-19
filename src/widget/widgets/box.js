/**
 * File: box.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 25.04.2017
 * Copyright: 2018, Institute for Automation of Complex Power Systems, EONERC
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

class WidgetBox extends Component {
  render() {

    let colors = EditWidgetColorControl.ColorPalette;

    let colorStyle = {
      borderColor: colors[this.props.widget.customProperties.border_color],
      backgroundColor: colors[this.props.widget.customProperties.background_color],
      opacity: this.props.widget.customProperties.background_color_opacity
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
