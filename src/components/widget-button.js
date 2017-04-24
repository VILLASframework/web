/**
 * File: widget-button.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 29.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';

import EditWidgetColorControl from './dialog/edit-widget-color-control';

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