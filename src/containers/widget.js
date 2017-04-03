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

import AppDispatcher from '../app-dispatcher';
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

import '../styles/widgets.css';

class Widget extends Component {
  static getStores() {
    return [ SimulatorDataStore, FileStore ];
  }

  static calculateState(prevState) {
    if (prevState) {
      return {
        simulatorData: SimulatorDataStore.getState(),
        files: FileStore.getState(),

        sequence: prevState.sequence + 1
      }
    } else {
      return {
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
    AppDispatcher.dispatch({
      type: 'files/start-load'
    });
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
    
    

    //console.log('render widget ' + this.props.data.z + this.props.data.type);

    // configure grid
    var grid = this.props.grid;
    if (!grid) {
      grid = [ 1, 1 ];
    }

    // get widget element
    const widget = this.props.data;
    var element = null;

    // dummy is passed to widgets to keep updating them while in edit mode
    if (widget.type === 'Value') {
      element = <WidgetValue widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulation={this.props.simulation} />
    } else if (widget.type === 'Plot') {
      element = <WidgetPlot widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulation={this.props.simulation} />
    } else if (widget.type === 'Table') {
      element = <WidgetTable widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulation={this.props.simulation} />
    } else if (widget.type === 'Label') {
      element = <WidgetLabel widget={widget} />
    } else if (widget.type === 'PlotTable') {
      element = <WidgetPlotTable widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulation={this.props.simulation} editing={this.props.editing} />
    } else if (widget.type === 'Image') {
      element = <WidgetImage widget={widget} files={this.state.files} />
    } else if (widget.type === 'Button') {
      element = <WidgetButton widget={widget} editing={this.props.editing} />
    } else if (widget.type === 'NumberInput') {
      element = <WidgetNumberInput widget={widget} editing={this.props.editing} />
    } else if (widget.type === 'Slider') {
      element = <WidgetSlider widget={widget} editing={this.props.editing} />
    } else if (widget.type === 'Gauge') {
      element = <WidgetGauge widget={widget} data={this.state.simulatorData} editing={this.props.editing} simulation={this.props.simulation} />
    }
    
    if (this.props.editing) {
      return (
        <Rnd
          ref={c => { this.rnd = c; }}
          initial={{ x: Number(widget.x), y: Number(widget.y), width: widget.width, height: widget.height }}
          minWidth={ widget.minWidth }
          minHeight={ widget.minHeight }
          bounds={'parent'}
          className="editing-widget"
          onResizeStart={ (direction, styleSize, clientSize, event) => this.borderWasClicked(event) } 
          onResizeStop={(direction, styleSize, clientSize, delta) => this.resizeStop(direction, styleSize, clientSize, delta)}
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
        <div className="widget" style={{ width: Number(widget.width), height: Number(widget.height), left: Number(widget.x), top: Number(widget.y), 'zIndex': Number(widget.z), position: 'absolute' }}>
          {element}
        </div>
      );
    }
  }
}

export default Container.create(Widget);
