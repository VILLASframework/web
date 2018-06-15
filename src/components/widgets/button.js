/**
 * File: button.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 29.03.2017
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

import EditWidgetColorControl from '../dialogs/edit-widget-color-control';

class WidgetButton extends Component {

  action(e) {
    e.target.blur(); // Remove focus
    console.log('Button widget action');
  }

  render() {

    let colors = EditWidgetColorControl.ColorPalette;

    let colorStyle = {
      background: colors[this.props.widget.background_color],
      color: colors[this.props.widget.font_color],
      borderColor: colors[this.props.widget.font_color]
    }

    return (
      <div className="button-widget full">
          { this.props.editing ? (
                <button className="full btn btn-default" type="button" disabled onClick={ this.action } style={colorStyle}>{this.props.widget.name}</button>
            ) : (
                <button className="full btn btn-default" type="button" onClick={ this.action } style={colorStyle}>{this.props.widget.name}</button>
            )
          }
      </div>
    );
  }
}

export default WidgetButton;
