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
import AppDispatcher from '../app-dispatcher';

class Visualization extends Component {
  static getStores() {
    return [ VisualizationStore, ProjectStore, SimulationStore ];
  }

  static calculateState(prevState) {
    if (prevState == null) {
      prevState = {};
    }

    return {
      visualizations: VisualizationStore.getState(),
      projects: ProjectStore.getState(),
      simulations: SimulationStore.getState(),

      visualization: prevState.visualization || {},
      project: prevState.project || null,
      simulation: prevState.simulation || null,
      editing: prevState.editing || false,
      grid: prevState.grid || false,

      editModal: prevState.editModal || false,
      modalData: prevState.modalData || null,
      modalIndex: prevState.modalIndex || null
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

  reloadVisualization() {
    // select visualization by param id
    this.state.visualizations.forEach((visualization) => {
      if (visualization._id === this.props.params.visualization) {
        // JSON.parse(JSON.stringify(obj)) = deep clone to make also copy of widget objects inside
        this.setState({ visualization: JSON.parse(JSON.stringify(visualization)), project: null });

        AppDispatcher.dispatch({
          type: 'projects/start-load',
          data: visualization.project
        });
      }
    });
  }

  handleDrop(item) {
    // add new widget
    var widget = {
      name: 'Name',
      type: item.name,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      z: 0
    };

    // set type specific properties
    if (item.name === 'Value') {
      widget.simulator = this.state.simulation.models[0].simulator;
      widget.signal = 0;
    } else if (item.name === 'Plot') {
      widget.simulator = this.state.simulation.models[0].simulator;
      widget.signals = [ 0 ];
      widget.time = 300;
      widget.width = 400;
      widget.height = 200;
    } else if (item.name === 'Table') {
      widget.simulator = this.state.simulation.models[0].simulator;
      widget.width = 400;
      widget.height = 200;
    } else if (item.name === 'Label') {

    }

    var visualization = this.state.visualization;
    visualization.widgets.push(widget);

    this.setState({ visualization: visualization });
    this.forceUpdate();
  }

  widgetChange(widget, index) {
    // save changes temporarily
    var visualization = this.state.visualization;
    visualization.widgets[index] = widget;

    this.setState({ visualization: visualization });
  }

  editWidget(e, data) {
    this.setState({ editModal: true, modalData: this.state.visualization.widgets[data.index], modalIndex: data.index });
  }

  closeEdit(data) {
    if (data) {
      // save changes temporarily
      var visualization = this.state.visualization;
      visualization.widgets[this.state.modalIndex] = data;

      this.setState({ editModal: false, visualization: visualization });
    } else {
      this.setState({ editModal: false });
    }
  }

  deleteWidget(e, data) {
    // delete widget temporarily
    var visualization = this.state.visualization;
    visualization.widgets.splice(data.index, 1);

    this.setState({ visualization: visualization });
    this.forceUpdate();
  }

  saveChanges() {
    AppDispatcher.dispatch({
      type: 'visualizations/start-edit',
      data: this.state.visualization
    });

    this.setState({ editing: false });
  }

  discardChanges() {
    this.setState({ editing: false, visualization: {} });

    this.reloadVisualization();
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <div>
          <h1>
            {this.state.visualization.name}
          </h1>

          <div>
            {this.state.editing ? (
              <div>
                <Button bsStyle="link" onClick={() => this.saveChanges()}>Save</Button>
                <Button bsStyle="link" onClick={() => this.discardChanges()}>Cancel</Button>
              </div>
            ) : (
              <Button bsStyle="link" onClick={() => this.setState({ editing: true })}>Edit</Button>
            )}
          </div>
        </div>

        <div>
          {this.state.editing &&
            <div className="toolbox">
              <ToolboxItem name="Value" type="widget" />
              <ToolboxItem name="Plot" type="widget" />
              <ToolboxItem name="Table" type="widget" />
              <ToolboxItem name="Label" type="widget" />
              <ToolboxItem name="Image" type="widget" disabled />
            </div>
          }

          <Dropzone onDrop={item => this.handleDrop(item)} editing={this.state.editing}>
            {this.state.visualization.widgets != null &&
              this.state.visualization.widgets.map((widget, index) => (
              <Widget key={index} data={widget} simulation={this.state.simulation} onWidgetChange={(w, i) => this.widgetChange(w, i)} editing={this.state.editing} index={index} grid={this.state.grid} />
            ))}
          </Dropzone>

          {this.state.visualization.widgets != null &&
            this.state.visualization.widgets.map((widget, index) => (
              <ContextMenu id={'widgetMenu' + index} key={index}>
                <MenuItem data={{index: index}} onClick={(e, data) => this.editWidget(e, data)}>Edit</MenuItem>
                <MenuItem data={{index: index}} onClick={(e, data) => this.deleteWidget(e, data)}>Delete</MenuItem>
              </ContextMenu>
          ))}

          <EditWidget show={this.state.editModal} onClose={(data) => this.closeEdit(data)} widget={this.state.modalData} simulation={this.state.simulation} />
        </div>
      </div>
    );
  }
}

export default Container.create(Visualization);
