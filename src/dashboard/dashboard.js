/**
 * File: dashboard.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
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

import React from 'react';
import { Container } from 'flux/utils';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { ContextMenu, Item, Separator } from 'react-contexify';
import Fullscreenable from 'react-fullscreenable';
import Slider from 'rc-slider';
import classNames from 'classnames';

import Icon from '../common/icon';
import WidgetFactory from '../widget/widget-factory';
import ToolboxItem from './toolbox-item';
import Dropzone from './dropzone';
import Widget from '../widget/widget';
import EditWidget from '../widget/edit-widget';
import Grid from './grid';

import UserStore from '../user/user-store';
import DashboardStore from './dashboard-store';
import ProjectStore from '../project/project-store';
import SimulationStore from '../simulation/simulation-store';
import SimulationModelStore from '../simulationmodel/simulation-model-store';
import FileStore from '../file/file-store';
import AppDispatcher from '../common/app-dispatcher';
import NotificationsDataManager from '../common/data-managers/notifications-data-manager';
import NotificationsFactory from '../common/data-managers/notifications-factory';

import 'react-contexify/dist/ReactContexify.min.css';

class Dashboard extends React.Component {
  static getStores() {
    return [ DashboardStore, ProjectStore, SimulationStore, SimulationModelStore, FileStore, UserStore ];
  }

  static calculateState(prevState, props) {
    if (prevState == null) {
      prevState = {};
    }

    let simulationModels = [];
    if (prevState.simulation != null) {
      simulationModels = SimulationModelStore.getState().filter(m => prevState.simulation.models.includes(m._id));
    }

    return {
      sessionToken: UserStore.getState().token,
      dashboards: DashboardStore.getState(),
      projects: ProjectStore.getState(),
      simulations: SimulationStore.getState(),
      files: FileStore.getState(),

      dashboard: prevState.dashboard || {},
      project: prevState.project || null,
      simulation: prevState.simulation || null,
      simulationModels,
      editing: prevState.editing || false,
      paused: prevState.paused || false,

      editModal: prevState.editModal || false,
      modalData: prevState.modalData || null,
      modalIndex: prevState.modalIndex || null,

      maxWidgetHeight: prevState.maxWidgetHeight  || 0,
      dropZoneHeight: prevState.dropZoneHeight  || 0
    };
  }

  componentWillMount() {
    // TODO: Don't fetch token from local, use user-store!
    const token = localStorage.getItem('token');

    //document.addEventListener('keydown', this.handleKeydown.bind(this));

    AppDispatcher.dispatch({
      type: 'dashboards/start-load',
      token
    });
  }

  componentWillUnmount() {
      //document.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  componentDidUpdate() {
    if (this.state.dashboard._id !== this.props.match.params.dashboard) {
      this.reloadDashboard();
    }

    // load depending project
    if (this.state.project == null && this.state.projects) {
      this.state.projects.forEach((project) => {
        if (project._id === this.state.dashboard.project) {
          this.setState({ project: project, simulation: null });

          const token = localStorage.getItem('token');

          AppDispatcher.dispatch({
            type: 'simulations/start-load',
            data: project.simulation,
            token
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

  /*handleKeydown(e) {
    switch (e.key) {
      case ' ':
      case 'p':
        this.setState({ paused: !this.state.paused });
        break;
      case 'e':
        this.setState({ editing: !this.state.editing });
        break;
      case 'f':
        this.props.toggleFullscreen();
        break;
      default:
    }
  }*/

  transformToWidgetsDict(widgets) {
    var widgetsDict = {};
    // Create a new key and make a copy of the widget object
    var key = 0;
    widgets.forEach( (widget) => widgetsDict[key++] = Object.assign({}, widget) );
    return widgetsDict;
  }

  transformToWidgetsList(widgets) {
    return Object.keys(widgets).map( (key) => widgets[key]);
  }

  reloadDashboard() {
    // select dashboard by param id
    this.state.dashboards.forEach((tempDashboard) => {
      if (tempDashboard._id === this.props.match.params.dashboard) {

        // convert widgets list to a dictionary
        var dashboard = Object.assign({}, tempDashboard, {
            widgets: tempDashboard.widgets ? this.transformToWidgetsDict(tempDashboard.widgets) : {}
        });

        this.computeHeightWithWidgets(dashboard.widgets);

        this.setState({ dashboard: dashboard, project: null });

        const token = localStorage.getItem('token');

        AppDispatcher.dispatch({
          type: 'projects/start-load',
          data: dashboard.project,
          token
        });
      }
    });
  }

  snapToGrid(value) {
    if (this.state.dashboard.grid === 1) return value;

    return Math.round(value / this.state.dashboard.grid) * this.state.dashboard.grid;
  }

  handleDrop(item, position) {

    let widget = null;
    let defaultSimulationModel = null;

    if (this.state.simulation.models && this.state.simulation.models.length === 0) {
      NotificationsDataManager.addNotification(NotificationsFactory.NO_SIM_MODEL_AVAILABLE);
    } else {
      defaultSimulationModel = this.state.simulation.models[0];
    }

    // snap position to grid
    position.x = this.snapToGrid(position.x);
    position.y = this.snapToGrid(position.y);

    // create new widget
    widget = WidgetFactory.createWidgetOfType(item.name, position, defaultSimulationModel);

    var new_widgets = this.state.dashboard.widgets;
    var new_key = Object.keys(new_widgets).length;

    new_widgets[new_key] = widget;

    var dashboard = Object.assign({}, this.state.dashboard, {
      widgets: new_widgets
    });

    this.increaseHeightWithWidget(widget);
    this.setState({ dashboard: dashboard });
  }

  widgetStatusChange(updated_widget, key) {
    // Widget changed internally, make changes effective then save them
    this.widgetChange(updated_widget, key, this.saveChanges);
  }

  widgetChange(updated_widget, key, callback = null) {
    var widgets_update = {};
    widgets_update[key] =  updated_widget;
    var new_widgets = Object.assign({}, this.state.dashboard.widgets, widgets_update);

    var dashboard = Object.assign({}, this.state.dashboard, {
      widgets: new_widgets
    });

    // Check if the height needs to be increased, the section may have shrunk if not
    if (!this.increaseHeightWithWidget(updated_widget)) {
      this.computeHeightWithWidgets(dashboard.widgets);
    }
    this.setState({ dashboard: dashboard }, callback);
  }

  /*
  * Set the initial height state based on the existing widgets
  */
  computeHeightWithWidgets(widgets) {
    // Compute max height from widgets
    let maxHeight = Object.keys(widgets).reduce( (maxHeightSoFar, widgetKey) => {
      let thisWidget = widgets[widgetKey];
      let thisWidgetHeight = thisWidget.y + thisWidget.height;

      return thisWidgetHeight > maxHeightSoFar? thisWidgetHeight : maxHeightSoFar;
    }, 0);

    this.setState({
      maxWidgetHeight: maxHeight,
      dropZoneHeight:  maxHeight + 80
    });
  }
  /*
  * Adapt the area's height with the position of the new widget.
  * Return true if the height increased, otherwise false.
  */
  increaseHeightWithWidget(widget) {
    let increased = false;
    let thisWidgetHeight = widget.y + widget.height;
    if (thisWidgetHeight > this.state.maxWidgetHeight) {
      increased = true;
      this.setState({
        maxWidgetHeight: thisWidgetHeight,
        dropZoneHeight:  thisWidgetHeight + 40
      });
    }
    return increased;
  }

  editWidget(e, data) {
    this.setState({ editModal: true, modalData: this.state.dashboard.widgets[data.key], modalIndex: data.key });
  }

  closeEdit(data) {
    if (data) {
      // save changes temporarily
      var widgets_update = {};
      widgets_update[this.state.modalIndex] = data;

      var new_widgets = Object.assign({}, this.state.dashboard.widgets, widgets_update);

      var dashboard = Object.assign({}, this.state.dashboard, {
        widgets: new_widgets
      });

      this.setState({ editModal: false, dashboard: dashboard });
    } else {
      this.setState({ editModal: false });
    }
  }

  deleteWidget(e, data) {
    delete this.state.dashboard.widgets[data.key];
    var dashboard = Object.assign({}, this.state.dashboard, {
        widgets: this.state.dashboard.widgets
      });
    this.setState({ dashboard: dashboard });
  }

  stopEditing() {
    // Provide the callback so it can be called when state change is applied
    this.setState({ editing: false }, this.saveChanges );
  }

  saveChanges() {
    // Transform to a list
    var dashboard = Object.assign({}, this.state.dashboard, {
        widgets: this.transformToWidgetsList(this.state.dashboard.widgets)
      });

      const token = localStorage.getItem('token');

    AppDispatcher.dispatch({
      type: 'dashboards/start-edit',
      data: dashboard,
      token
    });
  }

  discardChanges() {
    this.setState({ editing: false, dashboard: {} });

    this.reloadDashboard();
  }

  moveWidget(e, data, applyDirection) {
    var widget = this.state.dashboard.widgets[data.key];
    var updated_widgets = {};
    updated_widgets[data.key] = applyDirection(widget);
    var new_widgets = Object.assign({}, this.state.dashboard.widgets, updated_widgets);

    var dashboard = Object.assign({}, this.state.dashboard, {
      widgets: new_widgets
    });

    this.setState({ dashboard: dashboard });
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

  setGrid(value) {
    // value 0 would block all widgets, set 1 as 'grid disabled'
    if (value === 0) {
      value = 1;
    }

    let dashboard = Object.assign({}, this.state.dashboard, {
      grid: value
    });

    this.setState({ dashboard });
  }

  lockWidget(data) {
    // lock the widget
    let widget = this.state.dashboard.widgets[data.key];
    widget.locked = true;

    // update dashboard
    let widgets = {};
    widgets[data.key] = widget;
    widgets = Object.assign({}, this.state.dashboard.widgets, widgets);

    const dashboard = Object.assign({}, this.state.dashboard, { widgets });
    this.setState({ dashboard });
  }

  unlockWidget(data) {
    // lock the widget
    let widget = this.state.dashboard.widgets[data.key];
    widget.locked = false;

    // update dashboard
    let widgets = {};
    widgets[data.key] = widget;
    widgets = Object.assign({}, this.state.dashboard.widgets, widgets);

    const dashboard = Object.assign({}, this.state.dashboard, { widgets });
    this.setState({ dashboard });
  }

  pauseData = () => {
    this.setState({ paused: true });
  }

  unpauseData = () => {
    this.setState({ paused: false });
  }

  render() {
    const current_widgets = this.state.dashboard.widgets;

    let boxClasses = classNames('section', 'box', { 'fullscreen-container': this.props.isFullscreen });

    let buttons = []
    let editingControls = [];
    let gridControl = {};

    if (this.state.editing) {
      buttons.push({ click: () => this.stopEditing(), icon: 'save', text: 'Save' });
      buttons.push({ click: () => this.discardChanges(), icon: 'ban', text: 'Cancel' });

      gridControl = <div key={editingControls.length}>
                      <span>Grid: {this.state.dashboard.grid > 1 ? this.state.dashboard.grid : 'Disabled'}</span>
                      <Slider value={this.state.dashboard.grid} style={{ width: '80px' }} step={5} onChange={value => this.setGrid(value)} />
                    </div>
    }

    if (!this.props.isFullscreen) {
      buttons.push({ click: this.props.toggleFullscreen, icon: 'expand', text: 'Fullscreen' });
      buttons.push({ click: this.state.paused ? this.unpauseData : this.pauseData, icon: this.state.paused ? 'play' : 'pause', text: this.state.paused  ? 'Live' : 'Pause' });

      if (!this.state.editing)
        buttons.push({ click: () => this.setState({ editing: true }), icon: 'edit', text: 'Edit' });
    }

    const buttonList = buttons.map((btn, idx) =>
      <Button key={idx} bsStyle="info" onClick={btn.click} style={{ marginLeft: '8px' }}>
        <Icon icon={btn.icon} /> {btn.text}
      </Button>
    );

    // Only one topology widget at the time is supported
    let thereIsTopologyWidget = current_widgets && Object.values(current_widgets).filter( widget => widget.type === 'Topology').length > 0;
    let topologyItemMsg = !thereIsTopologyWidget? '' : 'Currently only one is supported';

    return (
      <div className={boxClasses} >
        <div className='section-header box-header'>
          <div className="section-title">
            <span>{this.state.dashboard.name}</span>
          </div>

          <div className="section-buttons-group-right">
            { this.state.editing && gridControl }
            { buttonList }
          </div>
        </div>

        <div className="box box-content" onContextMenu={ (e) => e.preventDefault() }>
          {this.state.editing &&
            <div className="toolbar">
              <ButtonToolbar className="section-buttons-group-right">
                { editingControls }
              </ButtonToolbar>
              <ButtonToolbar className="toolbox box-header">
                <ToolboxItem icon="star" name="CustomAction" type="widget" />
                <ToolboxItem icon="play" name="Action" type="widget" disabled={true} />
                <ToolboxItem icon="lightbulb" name="Lamp" type="widget" />
                <ToolboxItem icon="font" name="Value" type="widget" />
                <ToolboxItem icon="chart-area" name="Plot" type="widget" />
                <ToolboxItem icon="table" name="Table" type="widget" />
                <ToolboxItem icon="tag" name="Label" type="widget" />
                <ToolboxItem icon="image" name="Image" type="widget" />
                <ToolboxItem icon="table" name="PlotTable" type="widget" />
                <ToolboxItem icon="dot-circle" name="Button" type="widget" />
                <ToolboxItem icon="i-cursor" name="Input" type="widget" />
                <ToolboxItem icon="sliders-h" name="Slider" type="widget" />
                <ToolboxItem icon="tachometer-alt" name="Gauge" type="widget" />
                <ToolboxItem icon="square" name="Box" type="widget" />
                <ToolboxItem icon="code" name="HTML" type="html" />
                <ToolboxItem icon="project-diagram" name="Topology" type="widget" disabled={thereIsTopologyWidget} title={topologyItemMsg}/>
              </ButtonToolbar>
            </div>
          }

          <Dropzone height={this.state.dropZoneHeight} onDrop={(item, position) => this.handleDrop(item, position)} editing={this.state.editing}>
            {current_widgets != null &&
              Object.keys(current_widgets).map(widget_key => (
              <Widget
                key={widget_key}
                data={current_widgets[widget_key]}
                simulation={this.state.simulation}
                onWidgetChange={(w, k) => this.widgetChange(w, k)}
                onWidgetStatusChange={(w, k) => this.widgetStatusChange(w, k)}
                editing={this.state.editing}
                index={widget_key}
                grid={this.state.dashboard.grid}
                paused={this.state.paused}
              />
            ))}

            <Grid size={this.state.dashboard.grid} disabled={this.state.dashboard.grid === 1 || !this.state.editing} />
          </Dropzone>

          {current_widgets != null &&
            Object.keys(current_widgets).map(widget_key => {
              const data = { key: widget_key };

              const locked = this.state.dashboard.widgets[widget_key].locked;
              const disabledMove = locked || this.state.dashboard.widgets[widget_key].type === 'Box';

              return <ContextMenu style={{zIndex: 100}} id={'widgetMenu'+ widget_key} key={widget_key}>
                <Item disabled={locked} onClick={e => this.editWidget(e, data)}>Edit</Item>
                <Item disabled={locked} onClick={e => this.deleteWidget(e, data)}>Delete</Item>
                <Separator />
                <Item disabled={disabledMove} onClick={e => this.moveWidget(e, data, this.moveAbove)}>Move above</Item>
                <Item disabled={disabledMove} onClick={e => this.moveWidget(e, data, this.moveToFront)}>Move to front</Item>
                <Item disabled={disabledMove} onClick={e => this.moveWidget(e, data, this.moveUnderneath)}>Move underneath</Item>
                <Item disabled={disabledMove} onClick={e => this.moveWidget(e, data, this.moveToBack)}>Move to back</Item>
                <Separator />
                <Item disabled={locked} onClick={e => this.lockWidget(data)}>Lock</Item>
                <Item disabled={!locked} onClick={e => this.unlockWidget(data)}>Unlock</Item>
              </ContextMenu>
            })}

          <EditWidget sessionToken={this.state.sessionToken} show={this.state.editModal} onClose={(data) => this.closeEdit(data)} widget={this.state.modalData} simulationModels={this.state.simulationModels} files={this.state.files} />
        </div>
      </div>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Fullscreenable()(Container.create(fluxContainerConverter.convert(Dashboard), { withProps: true }));
