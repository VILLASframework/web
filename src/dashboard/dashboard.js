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
import EditFiles from '../file/edit-files'
import WidgetContextMenu from '../widget/widget-context-menu';
import WidgetToolbox from '../widget/widget-toolbox';
import WidgetArea from '../widget/widget-area';
import DashboardButtonGroup from './dashboard-button-group';

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
  static webSocketsOpened = false;
  static getStores() {
    return [ DashboardStore, FileStore, WidgetStore, SignalStore, ConfigStore, ICStore];
  }

  static calculateState(prevState, props) {
    if (prevState == null) {
      prevState = {};
    }

    const sessionToken = localStorage.getItem("token");

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
    if (dashboard !== undefined) {
      configs = ConfigStore.getState().filter(config => config.scenarioID === dashboard.scenarioID);
      files = FileStore.getState().filter(file => file.scenarioID === dashboard.scenarioID);

      if(dashboard.height === 0){
        dashboard.height = 400;
      }
      else if(maxHeight + 80 > dashboard.height)
      {
        dashboard.height = maxHeight + 80;
      }
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

      editModal:  prevState.editModal || false,
      filesEditModal: prevState.filesEditModal || false,
      filesEditSaveState: prevState.filesEditSaveState || [],
      modalData:  null,
      modalIndex:  null,
      widgetChangeData: [],
      widgetOrigIDs: prevState.widgetOrigIDs || [],

      maxWidgetHeight: maxHeight || null,
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
      param: '?dashboardID=' + parseInt(this.props.match.params.dashboard, 10),
    });

    // load ICs to enable that component configs and dashboards work with them
    AppDispatcher.dispatch({
      type: 'ics/start-load',
      token: this.state.sessionToken
    });

  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      // open web sockets if ICs are already known and sockets are not opened yet
    if(this.state.ics !== undefined && !Dashboard.webSocketsOpened){
      if(this.state.ics.length > 0){
        console.log("Starting to open IC websockets:", this.state.ics);
        AppDispatcher.dispatch({
          type: 'ics/open-sockets',
          data: this.state.ics
        });

        Dashboard.webSocketsOpened = true;
      }
    }


    if(prevState.dashboard === undefined && this.state.dashboard !== undefined){
      // the dashboard was loaded, so that the scenarioID is available

      // load configs of scenario
      AppDispatcher.dispatch({
        type: 'configs/start-load',
        token: this.state.sessionToken,
        param: '?scenarioID=' + this.state.dashboard.scenarioID
      });

      // load files of scenario
      AppDispatcher.dispatch({
        type: 'files/start-load',
        param: '?scenarioID=' + this.state.dashboard.scenarioID,
        token: this.state.sessionToken
      });
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


  transformToWidgetsList(widgets) {
    return Object.keys(widgets).map( (key) => widgets[key]);
  }

  handleDrop(widget) {
    widget.dashboardID = this.state.dashboard.id;

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



  editWidget(widget, index){
    this.setState({ editModal: true, modalData: widget, modalIndex: index });
  };

  startEditFiles(){
    let tempFiles = [];
    this.state.files.forEach( file => {
      tempFiles.push({
        id: file.id,
        name: file.name
      });
    })
    this.setState({filesEditModal: true, filesEditSaveState: tempFiles});
  }

  closeEditFiles(){
    this.setState({ filesEditModal: false });
  }

  closeEdit(data){

    if (data == null) {

      AppDispatcher.dispatch({
        type: 'widgets/start-load',
        token: this.state.sessionToken,
        param: '?dashboardID=' + this.state.dashboard.id
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
    let originalIDs = [];
    this.state.widgets.forEach( widget => {
      originalIDs.push(widget.id);
      if(widget.type === 'Slider' || widget.type === 'NumberInput' || widget.type === 'Button'){
        AppDispatcher.dispatch({
          type: 'widgets/start-edit',
          token: this.state.sessionToken,
          data: widget
        });
      }
    });
    this.setState({ editing: true, widgetOrigIDs: originalIDs });
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
    this.setState({ editing: false, widgetChangeData: []});
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
      this.state.widgets.forEach(widget => {
        let tempID = this.state.widgetOrigIDs.find(element => element === widget.id);
        if(typeof tempID === 'undefined'){
          AppDispatcher.dispatch({
            type: 'widgets/start-remove',
            data: widget,
            token: this.state.sessionToken
          });
        }
      })

    AppDispatcher.dispatch({
      type: 'widgets/start-load',
      token: this.state.sessionToken,
      param: '?dashboardID=' + this.state.dashboard.id
    });

    AppDispatcher.dispatch({
      type: 'dashboards/start-load',
      data: this.props.match.params.dashboard,
      token: this.state.sessionToken
    });
    this.setState({ editing: false, widgetChangeData: []});

  };

  setGrid(value) {

    let dashboard = this.state.dashboard;
    dashboard.grid = value;
    this.setState({ dashboard });
    this.forceUpdate();
  };

  setDashboardSize(value) {
    const maxHeight = Object.values(this.state.widgets).reduce((currentHeight, widget) => {
    const absolutHeight = widget.y + widget.height;

    return absolutHeight > currentHeight ? absolutHeight : currentHeight;
    }, 0);
    let dashboard = this.state.dashboard;

    if(value === -1){

      let tempHeight = this.state.dashboard.height - 50;

      if(tempHeight >= 400 && tempHeight >= (maxHeight + 80)){
        dashboard.height = tempHeight;
        this.setState({dashboard});
      }
    }
    else{
      dashboard.height = this.state.dashboard.height +50;
      this.setState( {dashboard});
    }

    this.forceUpdate();
  }

  pauseData(){
    this.setState({ paused: true });
  };

  unpauseData() {
    this.setState({ paused: false });
  };


  render() {
    if (this.state.dashboard === undefined){
      return <div className="section-title">  <span>{"Loading Dashboard..."}</span>  </div>
    }

    const grid = this.state.dashboard.grid;
    const boxClasses = classNames('section', 'box', { 'fullscreen-padding': this.props.isFullscreen });
    let draggable = this.state.editing;
    let dropZoneHeight = this.state.dashboard.height;
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
          onEditFiles = {this.startEditFiles.bind(this)}
        />
      </div>

      <div className="box box-content" onContextMenu={ (e) => e.preventDefault() }>
        {this.state.editing &&
        <WidgetToolbox grid={grid} onGridChange={this.setGrid.bind(this)} dashboard={this.state.dashboard} onDashboardSizeChange={this.setDashboardSize.bind(this)} widgets={this.state.widgets} />
        }
        {!draggable?(
        <WidgetArea widgets={this.state.widgets} dropZoneHeight = {dropZoneHeight} editing={this.state.editing} grid={grid} onWidgetAdded={this.handleDrop.bind(this)}>
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
          <WidgetArea widgets={this.state.widgets} editing={this.state.editing} dropZoneHeight= {dropZoneHeight} grid={grid} onWidgetAdded={this.handleDrop.bind(this)}>
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
          widget={this.state.modalData}
          signals={this.state.signals}
          files={this.state.files}
        />

        <EditFiles
          sessionToken={this.state.sessionToken}
          show={this.state.filesEditModal}
          onClose={this.closeEditFiles.bind(this)}
          signals={this.state.signals}
          files={this.state.files}
          scenarioID={this.state.dashboard.scenarioID}
        />


      </div>
    </div>;
  }
}


let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Fullscreenable()(Container.create(fluxContainerConverter.convert(Dashboard), { withProps: true }));
