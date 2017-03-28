/**
 * File: visualization.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { Button } from 'react-bootstrap';
import { ContextMenu, MenuItem } from 'react-contextmenu';

import ToolboxItem from '../components/toolbox-item';
import Dropzone from '../components/dropzone';
import Widget from './widget';
import EditWidget from '../components/dialog/edit-widget';

import VisualizationStore from '../stores/visualization-store';
import ProjectStore from '../stores/project-store';
import SimulationStore from '../stores/simulation-store';
import FileStore from '../stores/file-store';
import AppDispatcher from '../app-dispatcher';

class Visualization extends Component {
  static getStores() {
    return [ VisualizationStore, ProjectStore, SimulationStore, FileStore ];
  }

  static calculateState(prevState) {
    if (prevState == null) {
      prevState = {};
    }

    return {
      visualizations: VisualizationStore.getState(),
      projects: ProjectStore.getState(),
      simulations: SimulationStore.getState(),
      files: FileStore.getState(),

      visualization: prevState.visualization || {},
      project: prevState.project || null,
      simulation: prevState.simulation || null,
      editing: prevState.editing || false,
      grid: prevState.grid || false,

      editModal: prevState.editModal || false,
      modalData: prevState.modalData || null,
      modalIndex: prevState.modalIndex || null,

      last_widget_key: prevState.last_widget_key  || 0
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'visualizations/start-load'
    });
  }

  componentDidUpdate() {
    if (this.state.visualization._id !== this.props.params.visualization) {
      this.reloadVisualization();
    }

    // load depending project
    if (this.state.project == null && this.state.projects) {
      this.state.projects.forEach((project) => {
        if (project._id === this.state.visualization.project) {
          this.setState({ project: project, simulation: null });

          AppDispatcher.dispatch({
            type: 'simulations/start-load',
            data: project.simulation
          });
        }
      });
    }

    // load depending simulation
    if (this.state.simulation == null && this.state.simulations && this.state.project) {
      this.state.simulations.forEach((simulation) => {
        if (simulation._id === this.state.project.simulation) {
          this.setState({ simulation: simulation });
        }
      });
    }
  }
  
  getNewWidgetKey() {
    // Increase the counter and update the state
    return this.state.last_widget_key++;
  }

  transformToWidgetsDict(widgets) {
    var widgetsDict = {};
    // Create a new key and make a copy of the widget object
    widgets.forEach( (widget) => widgetsDict[this.getNewWidgetKey()] = Object.assign({}, widget) );
    return widgetsDict;
  }

  transformToWidgetsList(widgets) {
    return Object.keys(widgets).map( (key) => widgets[key]);
  }

  reloadVisualization() {
    // select visualization by param id
    this.state.visualizations.forEach((tempVisualization) => {
      if (tempVisualization._id === this.props.params.visualization) {

        // convert widgets list to a dictionary
        var visualization = Object.assign({}, tempVisualization, {
            widgets: tempVisualization.widgets? this.transformToWidgetsDict(tempVisualization.widgets) : {}
        });

        this.setState({ visualization: visualization, project: null });

        AppDispatcher.dispatch({
          type: 'projects/start-load',
          data: visualization.project
        });
      }
    });
  }

  handleDrop(item, position) {
    // add new widget
    var widget = {
      name: 'Name',
      type: item.name,
      width: 100,
      height: 100,
      x: position.x,
      y: position.y,
      z: 0
    };

    // set type specific properties
    if (item.name === 'Value') {
      widget.simulator = this.state.simulation.models[0].simulator;
      widget.signal = 0;
      widget.minWidth = 70;
      widget.minHeight = 20;
    } else if (item.name === 'Plot') {
      widget.simulator = this.state.simulation.models[0].simulator;
      widget.signals = [ 0 ];
      widget.time = 60;
      widget.minWidth = 400;
      widget.minHeight = 200;
      widget.width = 400;
      widget.height = 200;
    } else if (item.name === 'Table') {
      widget.simulator = this.state.simulation.models[0].simulator;
      widget.minWidth = 300;
      widget.minHeight = 200;
      widget.width = 400;
      widget.height = 200;
    } else if (item.name === 'Label') {
      widget.minWidth = 70;
      widget.minHeight = 20;
    } else if (item.name === 'PlotTable') {
      widget.simulator = this.state.simulation.models[0].simulator;
      widget.minWidth = 400;
      widget.minHeight = 200;
      widget.width = 500;
      widget.height = 400;
      widget.time = 60
    } else if (item.name === 'Image') {
      widget.minWidth = 100;
      widget.minHeight = 100;
      widget.width = 200;
      widget.height = 200;
    }

    var new_widgets = this.state.visualization.widgets;

    var widget_key = this.getNewWidgetKey();
    new_widgets[widget_key] = widget;

    var visualization = Object.assign({}, this.state.visualization, {
      widgets: new_widgets
    });
    this.setState({ visualization: visualization });
  }

  widgetChange(updated_widget, key) {
    
    var widgets_update = {};
    widgets_update[key] =  updated_widget;
    var new_widgets = Object.assign({}, this.state.visualization.widgets, widgets_update);

    var visualization = Object.assign({}, this.state.visualization, {
      widgets: new_widgets
    });
    this.setState({ visualization: visualization });
  }

  editWidget(e, data) {
    this.setState({ editModal: true, modalData: this.state.visualization.widgets[data.key], modalIndex: data.key });
  }

  closeEdit(data) {
    if (data) {
      // save changes temporarily
      var widgets_update = {};
      widgets_update[this.state.modalIndex] =  data;
      
      var new_widgets = Object.assign({}, this.state.visualization.widgets, widgets_update);

      var visualization = Object.assign({}, this.state.visualization, {
        widgets: new_widgets
      });

      this.setState({ editModal: false, visualization: visualization });
    } else {
      this.setState({ editModal: false });
    }
  }

  deleteWidget(e, data) {
    delete this.state.visualization.widgets[data.key];
    var visualization = Object.assign({}, this.state.visualization, {
        widgets: this.state.visualization.widgets
      });
    this.setState({ visualization: visualization });
  }

  saveChanges() {
    // Transform to a list 
    var visualization = Object.assign({}, this.state.visualization, {
        widgets: this.transformToWidgetsList(this.state.visualization.widgets)
      });

    AppDispatcher.dispatch({
      type: 'visualizations/start-edit',
      data: visualization
    });

    this.setState({ editing: false });
  }

  discardChanges() {
    this.setState({ editing: false, visualization: {} });

    this.reloadVisualization();
  }

  moveWidget(e, data, applyDirection) {
    var widget = this.state.visualization.widgets[data.key];
    var updated_widgets = {};
    updated_widgets[data.key] =  applyDirection(widget);
    var new_widgets = Object.assign({}, this.state.visualization.widgets, updated_widgets);

    var visualization = Object.assign({}, this.state.visualization, {
      widgets: new_widgets
    });
    this.setState({ visualization: visualization });

  }

  moveAbove(widget) {
    // increase z-Order
    widget.z++;
     return widget;
  }

  moveToFront(widget) {
    // increase z-Order
    widget.z = 100;
    return widget;
  }

  moveUnderneath(widget) {
    // decrease z-Order
    widget.z--;
    if (widget.z < 0) {
      widget.z = 0;
    }
    return widget;
  }

  moveToBack(widget) {
    // increase z-Order
    widget.z = 0;
    return widget;
  }

  render() {
    // calculate widget area height
    var height = 0;

    var current_widgets = this.state.visualization.widgets;

    if (current_widgets) {
      Object.keys(current_widgets).forEach( (widget_key) => {
        var widget = current_widgets[widget_key];
        if (widget.y + widget.height > height) {
          height = widget.y + widget.height;
        }
      });

      // add padding
      height += 40;
    }

    return (
      <div className='section box'>
        <div className='section-header box-header'>
          <div className="section-title">
            <span>
              {this.state.visualization.name}
            </span>
          </div>
          {this.state.editing ? (
            <div className='section-buttons-group'>
              <Button bsStyle="link" onClick={() => this.saveChanges()}>
                <span className="glyphicon glyphicon-floppy-disk"></span> Save
              </Button>
              <Button bsStyle="link" onClick={() => this.discardChanges()}>
                <span className="glyphicon glyphicon-remove"></span> Cancel
              </Button>
            </div>
          ) : (
            <div className='section-buttons-group'>
              <Button bsStyle="link" onClick={() => this.setState({ editing: true })}>
                <span className="glyphicon glyphicon-pencil"></span> Edit
              </Button>
            </div>
          )}
        </div>

        <div className="box box-content">
          {this.state.editing &&
            <div className="toolbox box-header">
              <ToolboxItem name="Value" type="widget" />
              <ToolboxItem name="Plot" type="widget" />
              <ToolboxItem name="Table" type="widget" />
              <ToolboxItem name="Label" type="widget" />
              <ToolboxItem name="Image" type="widget" />
              <ToolboxItem name="PlotTable" type="widget" />
            </div>
          }

          <Dropzone height={height} onDrop={(item, position) => this.handleDrop(item, position)} editing={this.state.editing}>
            {current_widgets != null &&
              Object.keys(current_widgets).map( (widget_key) => (
              <Widget key={widget_key} data={current_widgets[widget_key]} simulation={this.state.simulation} onWidgetChange={(w, k) => this.widgetChange(w, k)} editing={this.state.editing} index={widget_key} grid={this.state.grid} />
            ))}
          </Dropzone>

          {current_widgets != null && 
            Object.keys(current_widgets).map( (widget_key) => (
              <ContextMenu id={'widgetMenu'+ widget_key} key={widget_key} >
                <MenuItem data={{key: widget_key}} onClick={(e, data) => this.editWidget(e, data)}>Edit</MenuItem>
                <MenuItem data={{key: widget_key}} onClick={(e, data) => this.deleteWidget(e, data)}>Delete</MenuItem>
                <MenuItem divider />
                <MenuItem data={{key: widget_key}} onClick={(e, data) => this.moveWidget(e, data, this.moveAbove)}>Move above</MenuItem>
                <MenuItem data={{key: widget_key}} onClick={(e, data) => this.moveWidget(e, data, this.moveToFront)}>Move to front</MenuItem>
                <MenuItem data={{key: widget_key}} onClick={(e, data) => this.moveWidget(e, data, this.moveUnderneath)}>Move underneath</MenuItem>
                <MenuItem data={{key: widget_key}} onClick={(e, data) => this.moveWidget(e, data, this.moveToBack)}>Move to back</MenuItem>
              </ContextMenu>
          ))}

          <EditWidget show={this.state.editModal} onClose={(data) => this.closeEdit(data)} widget={this.state.modalData} simulation={this.state.simulation} files={this.state.files} />
        </div>
      </div>
    );
  }
}

export default Container.create(Visualization);
