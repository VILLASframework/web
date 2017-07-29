/**
 * File: widget.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
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
import { Container } from 'flux/utils';
import { ContextMenuTrigger } from 'react-contextmenu';
import Rnd from 'react-rnd';
import classNames from 'classnames';

import AppDispatcher from '../app-dispatcher';
import UserStore from '../stores/user-store';
import SimulatorDataStore from '../stores/simulator-data-store';
import FileStore from '../stores/file-store';

import WidgetValue from '../components/widget-value';
import WidgetPlot from '../components/widget-plot';
import WidgetTable from '../components/widget-table';
import WidgetLabel from '../components/widget-label';
import WidgetPlotTable from '../components/widget-plot-table';
import WidgetImage from '../components/widget-image';
import WidgetButton from '../components/widget-button';
import WidgetNumberInput from '../components/widget-number-input';
import WidgetSlider from '../components/widget-slider';
import WidgetGauge from '../components/widget-gauge';
import WidgetBox from '../components/widget-box';

import '../styles/widgets.css';

class Widget extends Component {
  static getStores() {
    return [ SimulatorDataStore, FileStore, UserStore ];
  }

  static calculateState(prevState) {

    let tokenState = UserStore.getState().token;

    if (prevState) {
      return {
        sessionToken: tokenState,
        simulatorData: SimulatorDataStore.getState(),
        files: FileStore.getState(),

        sequence: prevState.sequence + 1
      }
    } else {
      return {
        sessionToken: tokenState,
        simulatorData: SimulatorDataStore.getState(),
        files: FileStore.getState(),

        sequence: 0
      };
    }
  }

  constructor(props) {
    super(props);

    // Reference to the context menu element
    this.contextMenuTriggerViaDraggable = null;
  }
  
  componentWillMount() {
    // If loading for the first time
    if (this.state.sessionToken) {
      AppDispatcher.dispatch({
        type: 'files/start-load',
        token: this.state.sessionToken
      });
    }
  }

  snapToGrid(value) {
    if (this.props.grid === 1) return value;

    return Math.round(value / this.props.grid) * this.props.grid;
  }

  drag(event, ui) {
    let x = this.snapToGrid(ui.position.left);
    let y = this.snapToGrid(ui.position.top);

    if (x !== ui.position.left || y !== ui.position.top) {
      this.rnd.updatePosition({ x, y });
    }
  }

  dragStop(event, ui) {
    // update widget
    var widget = this.props.data;
    widget.x = this.snapToGrid(ui.position.left);
    widget.y = this.snapToGrid(ui.position.top);

    this.props.onWidgetChange(widget, this.props.index);
  }

  resizeStop(direction, styleSize, clientSize, delta) {
    // update widget
    let widget = Object.assign({}, this.props.data);

    // resize depends on direction
    if (direction === 'left' || direction === 'topLeft' || direction === 'bottomLeft') {
      widget.x -= delta.width;
    }

    if (direction === 'top' || direction === 'topLeft' || direction === 'topRight') {
      widget.y -= delta.height;
    }

    widget.width = styleSize.width;
    widget.height = styleSize.height;

    this.props.onWidgetChange(widget, this.props.index);
  }

  borderWasClicked(e) {
    // check if it was triggered by the right button
    if (e.button === 2) {
      // launch the context menu using the reference
      if(this.contextMenuTriggerViaDraggable) {
          this.contextMenuTriggerViaDraggable.handleContextClick(e);
      }
    }
  }

  render() {
    // configure grid
    let grid = [this.props.grid, this.props.grid];

    // get widget element
    const widget = this.props.data;
    let borderedWidget = false;
    var element = null;

    // dummy is passed to widgets to keep updating them while in edit mode
    if (widget.type === 'Value') {
      element = <WidgetValue widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulation={this.props.simulation} />
    } else if (widget.type === 'Plot') {
      element = <WidgetPlot widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulation={this.props.simulation} />
      borderedWidget = true;
    } else if (widget.type === 'Table') {
      element = <WidgetTable widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulation={this.props.simulation} />
    } else if (widget.type === 'Label') {
      element = <WidgetLabel widget={widget} />
    } else if (widget.type === 'PlotTable') {
      element = <WidgetPlotTable widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulation={this.props.simulation} editing={this.props.editing} onWidgetChange={(w) => this.props.onWidgetStatusChange(w, this.props.index) } />
      borderedWidget = true;
    } else if (widget.type === 'Image') {
      element = <WidgetImage widget={widget} files={this.state.files} token={this.state.sessionToken} />
    } else if (widget.type === 'Button') {
      element = <WidgetButton widget={widget} editing={this.props.editing} />
    } else if (widget.type === 'NumberInput') {
      element = <WidgetNumberInput widget={widget} editing={this.props.editing} />
    } else if (widget.type === 'Slider') {
      element = <WidgetSlider widget={widget} editing={this.props.editing} onWidgetChange={(w) => this.props.onWidgetStatusChange(w, this.props.index) } />
    } else if (widget.type === 'Gauge') {
      element = <WidgetGauge widget={widget} data={this.state.simulatorData} editing={this.props.editing} simulation={this.props.simulation} />
    } else if (widget.type === 'Box') {
      element = <WidgetBox widget={widget} editing={this.props.editing} />
    }
    
    const widgetClasses = classNames({
      'widget': !this.props.editing,
      'editing-widget': this.props.editing,
      'border': borderedWidget,
      'unselectable': this.props.editing
    });

    if (this.props.editing) {
      return (
        <Rnd
          ref={c => { this.rnd = c; }}
          initial={{ x: Number(widget.x), y: Number(widget.y), width: widget.width, height: widget.height }}
          minWidth={ widget.minWidth }
          minHeight={ widget.minHeight }
          lockAspectRatio={Boolean(widget.lockAspect)}
          bounds={'parent'}
          className={ widgetClasses }
          onResizeStart={ (direction, styleSize, clientSize, event) => this.borderWasClicked(event) } 
          onResizeStop={(direction, styleSize, clientSize, delta) => this.resizeStop(direction, styleSize, clientSize, delta)}
          onDrag={(event, ui) => this.drag(event, ui)}
          onDragStop={(event, ui) => this.dragStop(event, ui)}
          moveGrid={grid}
          resizeGrid={grid}
          zIndex={widget.z}
        >
          <ContextMenuTrigger id={'widgetMenu' + this.props.index} ref={c => this.contextMenuTriggerViaDraggable = c} >
            {element}
          </ContextMenuTrigger>
        </Rnd>
      );
    } else {
      return (
        <div className={ widgetClasses } style={{ width: Number(widget.width), height: Number(widget.height), left: Number(widget.x), top: Number(widget.y), 'zIndex': Number(widget.z), position: 'absolute' }}>
          {element}
        </div>
      );
    }
  }
}

export default Container.create(Widget);
