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
import VisualizationStore from '../stores/visualization-store';
import AppDispatcher from '../app-dispatcher';

class Visualization extends Component {
  static getStores() {
    return [ VisualizationStore ];
  }

  static calculateState(prevState) {
    if (prevState) {
      return {
        visualizations: VisualizationStore.getState(),

        visualization: prevState.visualization,
        editing: prevState.editing,
        grid: prevState.grid
      };
    }

    return {
      visualizations: VisualizationStore.getState(),

      visualization: {},
      editing: false,
      grid: false
    }
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

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'visualizations/start-load'
    });

    AppDispatcher.dispatch({
      type: 'simulatorData/open',
      endpoint: 'localhost:5000',
      identifier: 'RTDS'
    });
  }

  componentDidUpdate() {
    if (this.state.visualization._id !== this.props.params.visualization) {
      this.reloadVisualization();
    }
  }

  reloadVisualization() {
    // select visualization by param id
    this.state.visualizations.forEach((visualization) => {
      if (visualization._id === this.props.params.visualization) {
        // JSON.parse(JSON.stringify(obj)) = deep clone to make also copy of widget objects inside
        this.setState({ visualization: JSON.parse(JSON.stringify(visualization)) });
      }
    });
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
            </div>
          }

          <Dropzone onDrop={item => this.handleDrop(item)} editing={this.state.editing}>
            {this.state.visualization.widgets != null &&
              this.state.visualization.widgets.map((widget, index) => (
              <Widget key={index} data={widget} onWidgetChange={(w, i) => this.widgetChange(w, i)} editing={this.state.editing} index={index} grid={this.state.grid} />
            ))}
          </Dropzone>

          {this.state.visualization.widgets != null &&
            this.state.visualization.widgets.map((widget, index) => (
              <ContextMenu id={'widgetMenu' + index} key={index}>
                <MenuItem data={{index: index}} onClick={(e, data) => this.editWidget(e, data)}>Edit</MenuItem>
                <MenuItem data={{index: index}} onClick={(e, data) => this.deleteWidget(e, data)}>Delete</MenuItem>
              </ContextMenu>
          ))}
        </div>
      </div>
    );
  }
}

export default Container.create(Visualization);
