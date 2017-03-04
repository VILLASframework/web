/**
 * File: widget.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { ContextMenuTrigger } from 'react-contextmenu';
import Rnd from 'react-rnd';

import SimulatorDataStore from '../stores/simulator-data-store';

import '../styles/widgets.css';

class Widget extends Component {
  static getStores() {
    return [ SimulatorDataStore ];
  }

  static calculateState() {
    return {
      simulatorData: SimulatorDataStore.getState(),

      widget: {}
    };
  }

  dragStop(event, ui) {
    // update widget
    var widget = this.props.data;
    widget.x = ui.position.left;
    widget.y = ui.position.top;

    this.props.onWidgetChange(widget, this.props.index);
  }

  resizeStop(direction, styleSize, clientSize, delta) {
    // update widget
    var widget = this.props.data;
    widget.width = styleSize.width;
    widget.height = styleSize.height;

    this.props.onWidgetChange(widget, this.props.index);
  }

  render() {
    const widget = this.props.data;

    var value = '';

    if (this.state.simulatorData.RTDS && this.state.simulatorData.RTDS.values) {
      const arr = this.state.simulatorData.RTDS.values[this.props.index];
      value = arr[arr.length - 1].y;
    }

    if (this.props.editing) {
      return (
        <Rnd
          ref={c => { this.rnd = c; }}
          initial={{ x: Number(widget.x), y: Number(widget.y), width: widget.width, height: widget.height }}
          bounds={'parent'}
          className="widget"
          onResizeStop={(direction, styleSize, clientSize, delta) => this.resizeStop(direction, styleSize, clientSize, delta)}
          onDragStop={(event, ui) => this.dragStop(event, ui)}
        >
          <ContextMenuTrigger id={'widgetMenu' + this.props.index} attributes={{ style: { width: '100%', height: '100%' } }}>
              <div>{value}</div>
          </ContextMenuTrigger>
        </Rnd>
      );
    } else {
      return (
        <div className="widget" style={{ width: Number(widget.width), height: Number(widget.height), left: Number(widget.x), top: Number(widget.y), position: 'absolute' }}>
          {value}
        </div>
      );
    }
  }
}

export default Container.create(Widget);
