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

import ToolboxItem from '../components/toolbox-item';
import Dropzone from '../components/dropzone';
import Widget from '../components/widget';
import VisualizationStore from '../stores/visualization-store';
import AppDispatcher from '../app-dispatcher';

class Visualization extends Component {
  static getStores() {
    return [ VisualizationStore ];
  }

  static calculateState() {
    return {
      visualizations: VisualizationStore.getState(),

      visualization: {},
      editing: false
    }
  }

  handleDrop(item) {
    console.log(item);
  }

  widgetChange(widget) {
    console.log(widget);
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
  }

  reloadVisualization() {
    // select visualization by param id
    this.state.visualizations.forEach((visualization) => {
      if (visualization._id === this.props.params.visualization) {
        this.setState({ visualization: visualization });
      }
    });
  }

  render() {
    return (
      <div>
        <h1>{this.state.visualization.name}</h1>

        <div>
          {this.state.editing ? (
            <div>
              <Button bsStyle="link" onClick={() => this.setState({ editing: false })}>Save</Button>
              <Button bsStyle="link" onClick={() => this.setState({ editing: false })}>Cancel</Button>
            </div>
          ) : (
            <Button bsStyle="link" onClick={() => this.setState({ editing: true })}>Edit</Button>
          )}
        </div>

        {this.state.editing &&
          <div className="toolbox">
            <ToolboxItem name="Value" type="widget" />
          </div>
        }

        <Dropzone onDrop={item => this.handleDrop(item)} editing={this.state.editing}>
          {this.state.visualization.widgets != null &&
            this.state.visualization.widgets.map((widget, index) => (
            <Widget key={index} data={widget} onWidgetChange={this.widgetChange} editing={this.state.editing} />
          ))}
        </Dropzone>
      </div>
    );
  }
}

export default Container.create(Visualization);
