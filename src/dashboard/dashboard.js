/**
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

import React, {Component} from 'react';
import { Container } from 'flux/utils';
import Fullscreenable from 'react-fullscreenable';
import classNames from 'classnames';

import Widget from '../widget/widget';
import EditWidget from '../widget/edit-widget/edit-widget';
import WidgetContextMenu from '../widget/widget-context-menu';
import WidgetToolbox from '../widget/widget-toolbox';
import WidgetArea from '../widget/widget-area';
import DashboardButtonGroup from './dashboard-button-group';

import LoginStore from '../user/login-store';
import DashboardStore from './dashboard-store';
import SignalStore from '../signal/signal-store'
import FileStore from '../file/file-store';
import WidgetStore from '../widget/widget-store';
import ICStore from '../ic/ic-store'
import ConfigStore from '../componentconfig/config-store'
import AppDispatcher from '../common/app-dispatcher';

import 'react-contexify/dist/ReactContexify.min.css';

class Dashboard extends Component {

  static lastWidgetKey = 0;
  static getStores() {
    return [ DashboardStore, LoginStore,FileStore, WidgetStore, SignalStore, ConfigStore, ICStore];
  }

  static calculateState(prevState, props) {
    if (prevState == null) {
      prevState = {};
    }

    const sessionToken = LoginStore.getState().token;

    let dashboard = DashboardStore.getState().find(d => d.id === parseInt(props.match.params.dashboard, 10));
    if (dashboard == null){
      AppDispatcher.dispatch({
        type: 'dashboards/start-load',
        data: props.match.params.dashboard,
        token: sessionToken
      });
    }

    // obtain all widgets of this dashboard
    let widgets = WidgetStore.getState().filter(w => w.dashboardID === parseInt(props.match.params.dashboard, 10));

    // compute max y coordinate
    let maxHeight = null;
    maxHeight = Object.keys(widgets).reduce( (maxHeightSoFar, widgetKey) => {
      let thisWidget = widgets[widgetKey];
      let thisWidgetHeight = thisWidget.y + thisWidget.height;

      return thisWidgetHeight > maxHeightSoFar? thisWidgetHeight : maxHeightSoFar;
    }, 0);

    // filter component configurations to the ones that belong to this scenario
    let configs = []
    let files = []
    if (dashboard !== null) {
      configs = ConfigStore.getState().filter(config => config.scenarioID === dashboard.scenarioID);
      files = FileStore.getState().filter(file => file.scenarioID === dashboard.scenarioID);
    }

    // filter signals to the ones belonging to the scenario at hand
    let signals = []
    let allSignals = SignalStore.getState();
    let sig, con;
    for (sig of allSignals){
      for (con of configs){
        if (sig.configID === con.id){
          signals.push(sig);
        }
      }
    }

    // filter ICs to the ones used by this scenario
    let ics = []
    if (configs.length > 0){
      ics = ICStore.getState().filter(ic => {
        let ICused = false;
        for (let config of configs){
          if (ic.id === config.icID){
            ICused = true;
            break;
          }
        }
        return ICused;
      });
    }

    return {
      dashboard,
      widgets,
      signals,
      sessionToken,
      files,
      configs,
      ics,

      editing: prevState.editing || false,
      paused: prevState.paused || false,

      editModal:  false,
      modalData:  null,
      modalIndex:  null,
      widgetChangeData: [],
      widgetAddData:prevState.widgetAddData || [],

      maxWidgetHeight: maxHeight || null,
      dropZoneHeight: maxHeight +80 || null,
    };

  }

  static getNewWidgetKey() {
    const widgetKey = this.lastWidgetKey;
    this.lastWidgetKey++;

    return widgetKey;
  }

  componentDidMount() {

    // load widgets of dashboard
    AppDispatcher.dispatch({
      type: 'widgets/start-load',
      token: this.state.sessionToken,
      param: '?dashboardID=' + this.state.dashboard.id
    });

    // open web sockets if ICs are already known
    if(this.state.ics.length > 0){
      console.log("Starting to open IC websockets:", this.state.ics);
      AppDispatcher.dispatch({
        type: 'ics/open-sockets',
        data: this.state.ics
      });
    } else {
      console.log("ICs unknown in componentDidMount", this.state.dashboard)
    }

  }

  componentWillUnmount() {
    // close web sockets of ICs
    console.log("Starting to close all web sockets");
    AppDispatcher.dispatch({
      type: 'ics/close-sockets',
    });
  }

  handleKeydown(e) {
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

  handleDrop(widget) {
    widget.dashboardID = this.state.dashboard.id;
    let tempChanges = this.state.widgetAddData;
    tempChanges.push(widget);

    this.setState({ widgetAddData: tempChanges})

    AppDispatcher.dispatch({
      type: 'widgets/start-add',
      token: this.state.sessionToken,
      data: widget
    });


  };


  widgetStatusChange(updated_widget, key) {
    // Widget changed internally, make changes effective then save them
    this.widgetChange(updated_widget, key, this.saveChanges);
  }

  widgetChange(widget, index, callback = null){
    let temp = this.state.widgetChangeData;
    temp.push(widget);
    this.setState({widgetChangeData: temp});

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


  editWidget(widget, index){
    this.setState({ editModal: true, modalData: widget, modalIndex: index });
  };

  uploadFile(data,widget){
    AppDispatcher.dispatch({
      type: 'files/start-upload',
      data: data,
      token: this.state.sessionToken,
      scenarioID: this.state.dashboard.scenarioID,
    });

  }

  closeEdit(data){

    if (data == null) {

      AppDispatcher.dispatch({
        type: 'widgets/start-load',
        token: this.state.sessionToken,
        param: '?dashboardID=1'
      });

      this.setState({ editModal: false });

      return;
    }

    AppDispatcher.dispatch({
      type: 'widgets/start-edit',
      token: this.state.sessionToken,
      data: data
    });

    this.setState({ editModal: false });
  };


  deleteWidget(widget, index) {

    AppDispatcher.dispatch({
      type: 'widgets/start-remove',
      data: widget,
      token: this.state.sessionToken
    });
  };


  startEditing(){
    this.state.widgets.forEach( widget => {
      if(widget.type === 'Slider' || widget.type === 'NumberInput' || widget.type === 'Button'){
        console.log("we should move in here");
      AppDispatcher.dispatch({
        type: 'widgets/start-edit',
        token: this.state.sessionToken,
        data: widget
      });
    }
    });
    this.setState({ editing: true });
  };

  saveEditing() {
    // Provide the callback so it can be called when state change is applied
    // TODO: Check if callback is needed
    AppDispatcher.dispatch({
      type: 'dashboards/start-edit',
      data: this.state.dashboard,
      token: this.state.sessionToken
    });

    this.state.widgetChangeData.forEach( widget => {
      AppDispatcher.dispatch({
        type: 'widgets/start-edit',
        token: this.state.sessionToken,
        data: widget
      });
    });
    this.setState({ editing: false, widgetChangeData: [], widgetAddData: [] });
  };

  saveChanges() {
    // Transform to a list
    const dashboard = Object.assign({}, this.state.dashboard.toJS(), {
        widgets: this.transformToWidgetsList(this.state.widgets)
      });

    AppDispatcher.dispatch({
      type: 'dashboards/start-edit',
      data: dashboard,
      token: this.state.sessionToken
    });
  }

  cancelEditing() {
    //raw widget has no id -> cannot be deleted in its original form
    let temp = [];
    this.state.widgetAddData.forEach(rawWidget => {
      this.state.widgets.forEach(widget => {
        if(widget.y === rawWidget.y && widget.x === rawWidget.x && widget.type === rawWidget.type){
          temp.push(widget);
        }
      })
    })

    temp.forEach( widget => {
      AppDispatcher.dispatch({
        type: 'widgets/start-remove',
        data: widget,
        token: this.state.sessionToken
      });
    });
    AppDispatcher.dispatch({
      type: 'widgets/start-load',
      token: this.state.sessionToken,
      param: '?dashboardID=1'
    });
    this.setState({ editing: false, widgetChangeData: [], widgetAddData: []});

  };

  setGrid(value) {

    let dashboard = this.state.dashboard;
    dashboard.grid = value;
    this.setState({ dashboard });
    this.forceUpdate();
  };

  pauseData(){
    this.setState({ paused: true });
  };

  unpauseData() {
    this.setState({ paused: false });
  };


  render() {
    const grid = this.state.dashboard.grid;
    const boxClasses = classNames('section', 'box', { 'fullscreen-padding': this.props.isFullscreen });
    let draggable = this.state.editing;
    return <div className={boxClasses} >
      <div className='section-header box-header'>
        <div className="section-title">
          <span>{this.state.dashboard.name}</span>
        </div>

        <DashboardButtonGroup
          editing={this.state.editing}
          onEdit={this.startEditing.bind(this)}
          fullscreen={this.props.isFullscreen}
          paused={this.state.paused}
          onSave={this.saveEditing.bind(this)}
          onCancel={this.cancelEditing.bind(this)}
          onFullscreen={this.props.toggleFullscreen}
          onPause={this.pauseData.bind(this)}
          onUnpause={this.unpauseData.bind(this)}
        />
      </div>

      <div className="box box-content" onContextMenu={ (e) => e.preventDefault() }>
        {this.state.editing &&
        <WidgetToolbox grid={grid} onGridChange={this.setGrid.bind(this)} widgets={this.state.widgets} />
        }
        {!draggable?(
        <WidgetArea widgets={this.state.widgets} editing={this.state.editing} grid={grid} onWidgetAdded={this.handleDrop.bind(this)}>
          {this.state.widgets != null && Object.keys(this.state.widgets).map(widgetKey => (
            <WidgetContextMenu
            key={widgetKey}
            index={parseInt(widgetKey,10)}
            widget={this.state.widgets[widgetKey]}
            onEdit={this.editWidget.bind(this)}
            onDelete={this.deleteWidget.bind(this)}
            onChange={this.widgetChange.bind(this)}

            onWidgetChange={this.widgetChange.bind(this)}
            onWidgetStatusChange={this.widgetStatusChange.bind(this)}
            editing={this.state.editing}
            grid={grid}
            paused={this.state.paused}
            />


          ))}
        </WidgetArea>
        ) : (
          <WidgetArea widgets={this.state.widgets} editing={this.state.editing} grid={grid} onWidgetAdded={this.handleDrop.bind(this)}>
          {this.state.widgets != null && Object.keys(this.state.widgets).map(widgetKey => (
            <Widget
              key={widgetKey}
              data={this.state.widgets[widgetKey]}
              onWidgetChange={this.widgetChange.bind(this)}
              onWidgetStatusChange={this.widgetStatusChange.bind(this)}
              editing={this.state.editing}
              index={parseInt(widgetKey,10)}
              grid={grid}
              paused={this.state.paused}
            />

          ))}
        </WidgetArea>

        )}

        <EditWidget
          sessionToken={this.state.sessionToken}
          show={this.state.editModal}
          onClose={this.closeEdit.bind(this)}
          onUpload = {this.uploadFile.bind(this)}
          widget={this.state.modalData}
          signals={this.state.signals}
          files={this.state.files}
        />


      </div>
    </div>;
  }
}


let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Fullscreenable()(Container.create(fluxContainerConverter.convert(Dashboard), { withProps: true }));
