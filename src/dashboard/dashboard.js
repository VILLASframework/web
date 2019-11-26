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
import Fullscreenable from 'react-fullscreenable';
import classNames from 'classnames';
import { Map } from 'immutable'

//import Icon from '../common/icon';
import Widget from '../widget/widget';
//import EditWidget from '../widget/edit-widget';

import WidgetContextMenu from './widget-context-menu';
import WidgetToolbox from './widget-toolbox';
import WidgetArea from './widget-area';
import DashboardButtonGroup from './dashboard-button-group';

import UserStore from '../user/user-store';
import DashboardStore from './dashboard-store';
import ProjectStore from '../project/project-store';
import SimulationStore from '../simulation/simulation-store';
import SimulationModelStore from '../simulationmodel/simulation-model-store';
import FileStore from '../file/file-store';
import WidgetStore from '../widget/widget-store';
import AppDispatcher from '../common/app-dispatcher';

import 'react-contexify/dist/ReactContexify.min.css';

class Dashboard extends React.Component {

  static lastWidgetKey = 0;
  static getStores() {
    return [ DashboardStore, ProjectStore, SimulationStore, SimulationModelStore, FileStore, UserStore, WidgetStore ];
  }

  static calculateState(prevState, props) {
    if (prevState == null) {
      prevState = {};
    }
    const sessionToken = UserStore.getState().token;
    let dashboard = Map();
    console.log("dashboard calculate state was called: " + props.match.params.dashboard);
    let dashboards = DashboardStore.getState()
    let rawDashboard =  dashboards[props.match.params.dashboard - 1];


    let str = JSON.stringify(rawDashboard, null, 4);
    console.log(str);
    if (rawDashboard != null) {
      dashboard = Map(rawDashboard);
      console.log("dashboard: " + dashboard);

      // convert widgets list to a dictionary to be able to reference widgets
      //let widgets = {};

      let rawWidgets = WidgetStore.getState();

      if(rawWidgets.length === 0){
        AppDispatcher.dispatch({
          type: 'widgets/start-load',
          token: sessionToken,
          param: '?dashboardID=1'
        });
      }

      let files = FileStore.getState();

      if(files.length === 0){
        AppDispatcher.dispatch({
          type: 'files/start-load',
          token: sessionToken,
          param: '?objectID=1&objectType=widget'
        });
      }


      console.log("here are the widgets: ");
      console.log(rawWidgets);

      dashboard = dashboard.set('widgets', rawWidgets);
      console.log("")


     /* for(let widget of dashboard.get('widgets')){
        console.log("load files got called")
        console.log(widget);
        AppDispatcher.dispatch({
          type: 'files/start-load',
          token: sessionToken,
          param: '?objectID=' + widget.id + '&objectType=widget'
        });
      }
     */



      //ist das überhaupt nötiG??
     /* if (this.state.dashboard.has('id') === false) {
        AppDispatcher.dispatch({
          type: 'dashboards/start-load',
          data: this.props.match.params.dashboard,
          token: this.state.sessionToken
        });
      }
      */



      /*if(Object.keys(widgets).length !== 0 ){
      this.computeHeightWithWidgets(widgets);
      }

      let selectedDashboards = dashboard;

    /* this.setState({ dashboard: selectedDashboards, project: null });

       AppDispatcher.dispatch({
           type: 'projects/start-load',
           data: selectedDashboards.get('project'),
           token: this.state.sessionToken
       });
*/
    }
    let widgets = {};

      for (let widget of dashboard.get('widgets')) {
        widgets[Dashboard.lastWidgetKey] = widget;
        console.log(" the last widgetKey: " + Dashboard.lastWidgetKey);
        Dashboard.lastWidgetKey++;
      }
      let maxHeight = Object.keys(widgets).reduce( (maxHeightSoFar, widgetKey) => {
      console.log("!! the widget key: "+ widgetKey);
      let thisWidget = widgets[widgetKey];
      let thisWidgetHeight = thisWidget.y + thisWidget.height;

      return thisWidgetHeight > maxHeightSoFar? thisWidgetHeight : maxHeightSoFar;
      }, 0);

      console.log("now the object keys: ");
      console.log(Object.keys(widgets));
    let simulationModels = [];
    //if (prevState.simulation != null) {
    //  simulationModels = SimulationModelStore.getState().filter(m => prevState.simulation.models.includes(m._id));
    //}

    return {
      rawDashboard,
      dashboard,
      widgets,

      sessionToken: sessionToken,
      projects: null, //ProjectStore.getState(),
      simulations: null, //SimulationStore.getState(),
      files: FileStore.getState(),

      project: prevState.project || null,
      simulation: prevState.simulation || null,
      simulationModels,
      editing: prevState.editing || false,
      paused: prevState.paused || false,

      //editModal: prevState.editModal || false,
      modalData: prevState.modalData || null,
      modalIndex: prevState.modalIndex || null,

      maxWidgetHeight: maxHeight,
      dropZoneHeight: maxHeight +80,
    };

  }

  static getNewWidgetKey() {
    const widgetKey = this.lastWidgetKey;
    this.lastWidgetKey++;

    return widgetKey;
  }

//!!!won't work anymore
 /* componentDidMount() {
    //document.addEventListener('keydown', this.handleKeydown.bind(this));
    console.log("problem in componentdidmount");
    if (this.state.dashboard.has('id') === false) {
      AppDispatcher.dispatch({
        type: 'dashboards/start-load',
        data: this.props.match.params.dashboard,
        token: this.state.sessionToken
      });
    }

  }


  componentWillUnmount() {
      //document.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  /*componentDidUpdate() {
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
  }*

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
  }

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

  transformToWidgetsList(widgets) {
    return Object.keys(widgets).map( (key) => widgets[key]);
  }

  reloadDashboard() {
    console.log("Error: reloadDashboard was called");
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

  handleDrop = widget => {
    const widgets = this.state.dashboard.get('widgets') || [];

    const widgetKey = this.getNewWidgetKey();
    widgets[widgetKey] = widget;

    const dashboard = this.state.dashboard.set('widgets');

    // this.increaseHeightWithWidget(widget);

    this.setState({ dashboard });
  };


  widgetStatusChange(updated_widget, key) {
    // Widget changed internally, make changes effective then save them
    this.widgetChange(updated_widget, key, this.saveChanges);
  }

  widgetChange = (widget, index, callback = null) => {
    const widgets = this.state.dashboard.get('widgets');
    widgets[index] = widget;

    const dashboard = this.state.dashboard.set('widgets');

    // Check if the height needs to be increased, the section may have shrunk if not
    if (!this.increaseHeightWithWidget(widget)) {
      this.computeHeightWithWidgets(dashboard.widgets);
    }

    this.setState({ dashboard }, callback);
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


  //editWidget = (widget, index) => {
  //  this.setState({ editModal: true, modalData: widget, modalIndex: index });
  //}


  closeEdit = data => {
    if (data == null) {
      this.setState({ editModal: false });

      return;
    }

    const widgets = this.state.dashboard.get('widgets');
    widgets[this.state.modalIndex] = data;

    const dashboard = this.state.dashboard.set('widgets', widgets);

    this.setState({ editModal: false, dashboard });
  };


  deleteWidget = (widget, index) => {
    const widgets = this.state.dashboard.get('widgets');
    delete widgets[index];

    const dashboard = this.state.dashboard.set('widgets');

    this.setState({ dashboard });
  };


  startEditing = () => {
    this.setState({ editing: true });
  };

  saveEditing = () => {
    // Provide the callback so it can be called when state change is applied
    // TODO: Check if callback is needed
    this.setState({ editing: false }, this.saveChanges );
  };

  saveChanges() {
    // Transform to a list
    const dashboard = Object.assign({}, this.state.dashboard.toJS(), {
        widgets: this.transformToWidgetsList(this.state.dashboard.get('widgets'))
      });

    AppDispatcher.dispatch({
      type: 'dashboards/start-edit',
      data: dashboard,
      token: this.state.sessionToken
    });
  }

  cancelEditing = () => {
    this.setState({ editing: false, dasboard: {} });

    this.reloadDashboard();
  };

  setGrid = value => {
    const dashboard = this.state.dashboard.set('grid', value);

    this.setState({ dashboard });
  };

  pauseData = () => {
    this.setState({ paused: true });
  };

  unpauseData = () => {
    this.setState({ paused: false });
  };


  render() {
    const widgets = this.state.dashboard.get('widgets');
    console.log("the widgets in render: ");
    console.log(widgets);
    const grid = this.state.dashboard.get('grid');
    console.log("the grid in render: "+ grid);

    const boxClasses = classNames('section', 'box', { 'fullscreen-padding': this.props.isFullscreen });

    return <div className={boxClasses} >
      <div className='section-header box-header'>
        <div className="section-title">
          <span>{this.state.dashboard.get('name')}</span>
        </div>

        <DashboardButtonGroup
          editing={this.state.editing}
          fullscreen={this.props.isFullscreen}
          paused={this.state.paused}
          onSave={this.saveEditing}
          onCancel={this.cancelEditing}
          onFullscreen={this.props.toggleFullscreen}
          onPause={this.pauseData}
          onUnpause={this.unpauseData}
        />
      </div>

      <div className="box box-content" onContextMenu={ (e) => e.preventDefault() }>
        {this.state.editing &&
        <WidgetToolbox grid={grid} onGridChange={this.setGrid} widgets={widgets} />
        }

        <WidgetArea widgets={widgets} editing={this.state.editing} grid={grid} onWidgetAdded={this.handleDrop}>
          {widgets != null && Object.keys(widgets).map(widgetKey => (
            <Widget
              key={widgetKey}
              data={widgets[widgetKey]}
              simulation={this.state.simulation}
              onWidgetChange={(w, k) => this.widgetChange(w, k)}
              onWidgetStatusChange={(w, k) => this.widgetStatusChange(w, k)}
              editing={this.state.editing}
              index={widgetKey}
              grid={grid}
              paused={this.state.paused}
            />
          ))}
        </WidgetArea>

        {/* TODO: Create only one context menu for all widgets */}
        {widgets != null && Object.keys(widgets).map(widgetKey => (
          <WidgetContextMenu key={widgetKey} index={parseInt(widgetKey,10)} widget={widgets[widgetKey]} onEdit={this.editWidget} onDelete={this.deleteWidget} onChange={this.widgetChange} />
        ))}


      </div>
    </div>;
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Fullscreenable()(Container.create(fluxContainerConverter.convert(Dashboard), { withProps: true }));
//<EditWidget sessionToken={this.state.sessionToken} show={this.state.editModal} onClose={this.closeEdit} widget={this.state.modalData} simulationModels={this.state.simulationModels} files={this.state.files} />
//onEdit={this.startEditing}
