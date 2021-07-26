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

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import Fullscreenable from 'react-fullscreenable';
import classNames from 'classnames';
import EditWidget from '../widget/edit-widget/edit-widget';
import EditFilesDialog from '../file/edit-files';
import EditSignalMappingDialog from "../signal/edit-signal-mapping";
import WidgetToolbox from '../widget/widget-toolbox';
import WidgetArea from './widget-area';
import DashboardButtonGroup from './dashboard-button-group';
import IconToggleButton from '../common/buttons/icon-toggle-button';
import DashboardStore from './dashboard-store';
import SignalStore from '../signal/signal-store'
import FileStore from '../file/file-store';
import WidgetStore from '../widget/widget-store';
import ICStore from '../ic/ic-store'
import ICDataStore from '../ic/ic-data-store'
import ConfigStore from '../componentconfig/config-store'
import ResultStore from '../result/result-store'
import AppDispatcher from '../common/app-dispatcher';
import ScenarioStore from '../scenario/scenario-store';
import 'react-contexify/dist/ReactContexify.min.css';
import WidgetContainer from '../widget/widget-container';
import Widget from "../widget/widget";

class Dashboard extends Component {

  static lastWidgetKey = 0;
  static webSocketsOpened = false;
  static getStores() {
    return [DashboardStore, FileStore, WidgetStore, SignalStore, ConfigStore, ICStore, ICDataStore, ScenarioStore, ResultStore];
  }

  static calculateState(prevState, props) {
    if (prevState == null) {
      prevState = {};
    }

    const sessionToken = localStorage.getItem("token");

    let dashboard = DashboardStore.getState().find(d => d.id === parseInt(props.match.params.dashboard, 10));
    if (dashboard == null) {
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
    maxHeight = Object.keys(widgets).reduce((maxHeightSoFar, widgetKey) => {
      let thisWidget = widgets[widgetKey];
      let thisWidgetHeight = thisWidget.y + thisWidget.height;

      return thisWidgetHeight > maxHeightSoFar ? thisWidgetHeight : maxHeightSoFar;
    }, 0);


    // filter component configurations to the ones that belong to this scenario
    let configs = [];
    let files = [];
    let locked = false;
    if (dashboard !== undefined) {
      configs = ConfigStore.getState().filter(config => config.scenarioID === dashboard.scenarioID);
      files = FileStore.getState().filter(file => file.scenarioID === dashboard.scenarioID);
      let scenario = ScenarioStore.getState().find(s => s.id === dashboard.scenarioID);
      if (scenario) {
        locked = scenario.isLocked;
      }
      if (dashboard.height === 0) {
        dashboard.height = 400;
      }
      else if (maxHeight + 80 > dashboard.height) {
        dashboard.height = maxHeight + 80;
      }
    }

    // filter signals to the ones belonging to the scenario at hand
    let signals = []
    let allSignals = SignalStore.getState();
    let sig, con;
    for (sig of allSignals) {
      for (con of configs) {
        if (sig.configID === con.id) {
          signals.push(sig);
        }
      }
    }

    // filter ICs to the ones used by this scenario
    let ics = []
    if (configs.length > 0) {
      ics = ICStore.getState().filter(ic => {
        let ICused = false;
        for (let config of configs) {
          if (ic.id === config.icID) {
            ICused = true;
            break;
          }
        }
        return ICused;
      });
    }

    let editOutputSignalsModal = prevState.editOutputSignalsModal;
    let editInputSignalsModal = prevState.editInputSignalsModal;

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
      editOutputSignalsModal: editOutputSignalsModal,
      editInputSignalsModal: editInputSignalsModal,
      filesEditModal: prevState.filesEditModal || false,
      filesEditSaveState: prevState.filesEditSaveState || [],
      modalData: prevState.modalData || null,
      modalIndex: prevState.modalIndex ||null,
      widgetChangeData: prevState.widgetChangeData || [],
      widgetOrigIDs: prevState.widgetOrigIDs || [],

      maxWidgetHeight: maxHeight || null,
      locked,
    };

  }

  static getNewWidgetKey() {
    const widgetKey = this.lastWidgetKey;
    this.lastWidgetKey++;

    return widgetKey;
  }

  componentDidMount() {

    Dashboard.webSocketsOpened = false;

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
    if (this.state.ics !== undefined && !Dashboard.webSocketsOpened) {

      if (this.state.signals.length > 0) {
        console.log("Starting to open IC websockets:", this.state.ics);
        AppDispatcher.dispatch({
          type: 'ics/open-sockets',
          data: this.state.ics,
        });

        Dashboard.webSocketsOpened = true;
      }
    }


    if (prevState.dashboard === undefined && this.state.dashboard !== undefined) {
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

      // load scenario for 'isLocked' value
      AppDispatcher.dispatch({
        type: 'scenarios/start-load',
        data: this.state.dashboard.scenarioID,
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
    return Object.keys(widgets).map((key) => widgets[key]);
  }

  handleDrop(widget) {
    widget.dashboardID = this.state.dashboard.id;

    AppDispatcher.dispatch({
      type: 'widgets/start-add',
      token: this.state.sessionToken,
      data: widget
    });


  };

  widgetChange(widget, index, callback = null) {
    let temp = this.state.widgetChangeData;
    temp.push(widget);
    this.setState({ widgetChangeData: temp });

  }

  onChange(widget, index, callback = null){
    AppDispatcher.dispatch({
      type: 'widgets/start-edit',
      token: this.state.sessionToken,
      data: widget
    });
  }

  editWidget(widget, index) {
    this.setState({ editModal: true, modalData: widget, modalIndex: index });
  };

  duplicateWidget(widget) {
    let widgetCopy = JSON.parse(JSON.stringify(widget));
    delete widgetCopy.id;
    widgetCopy.x = widgetCopy.x + 50;
    widgetCopy.y = widgetCopy.y + 50;

    AppDispatcher.dispatch({
      type: 'widgets/start-add',
      token: this.state.sessionToken,
      data: widgetCopy
    });
  };

  startEditFiles() {
    let tempFiles = [];
    this.state.files.forEach(file => {
      tempFiles.push({
        id: file.id,
        name: file.name
      });
    })
    this.setState({ filesEditModal: true, filesEditSaveState: tempFiles });
  }

  closeEditFiles() {
    this.state.widgets.map(widget => {
      if(widget.type === "Image"){
        widget.customProperties.update = true;
      }
    })
    this.setState({ filesEditModal: false });
  }

  closeEdit(data) {

    if (data == null) {

      AppDispatcher.dispatch({
        type: 'widgets/start-load',
        token: this.state.sessionToken,
        param: '?dashboardID=' + this.state.dashboard.id
      });

      this.setState({ editModal: false , modalData: null, modalIndex: null});

      return;
    }

    if(data.type === "Image")
    {
      data.customProperties.update = true;
    }

    AppDispatcher.dispatch({
      type: 'widgets/start-edit',
      token: this.state.sessionToken,
      data: data
    });

    this.setState({ editModal: false , modalData: null, modalIndex: null});
  };


  deleteWidget(widget, index) {

    AppDispatcher.dispatch({
      type: 'widgets/start-remove',
      data: widget,
      token: this.state.sessionToken
    });
  };


  startEditing() {
    let originalIDs = [];
    this.state.widgets.forEach(widget => {
      originalIDs.push(widget.id);
      if (widget.type === 'Slider' || widget.type === 'NumberInput' || widget.type === 'Button') {
        AppDispatcher.dispatch({
          type: 'widgets/start-edit',
          token: this.state.sessionToken,
          data: widget
        });
      }
      else if (widget.type === 'Image'){
        widget.customProperties.update = true;
      }
    });
    this.setState({ editing: true, widgetOrigIDs: originalIDs });
  };

  saveEditing() {
    this.state.widgets.forEach(widget => {
      if (widget.type === 'Image'){
        widget.customProperties.update = true;
      }
    });
    // Provide the callback so it can be called when state change is applied
    // TODO: Check if callback is needed
    AppDispatcher.dispatch({
      type: 'dashboards/start-edit',
      data: this.state.dashboard,
      token: this.state.sessionToken
    });

    this.state.widgetChangeData.forEach(widget => {
      AppDispatcher.dispatch({
        type: 'widgets/start-edit',
        token: this.state.sessionToken,
        data: widget
      });
    });
    this.setState({ editing: false, widgetChangeData: [] });
  };

  cancelEditing() {
    //raw widget has no id -> cannot be deleted in its original form
    this.state.widgets.forEach(widget => {
      if (widget.type === 'Image'){
        widget.customProperties.update = true;
      }
      let tempID = this.state.widgetOrigIDs.find(element => element === widget.id);
      if (typeof tempID === 'undefined') {
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
    this.setState({ editing: false, widgetChangeData: [] });

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

    if (value === -1) {

      let tempHeight = this.state.dashboard.height - 50;

      if (tempHeight >= 400 && tempHeight >= (maxHeight + 80)) {
        dashboard.height = tempHeight;
        this.setState({ dashboard });
      }
    }
    else {
      dashboard.height = this.state.dashboard.height + 50;
      this.setState({ dashboard });
    }

    this.forceUpdate();
  }

  pauseData() {
    this.setState({ paused: true });
  };

  unpauseData() {
    this.setState({ paused: false });
  };

  editInputSignals() {
    this.setState({ editInputSignalsModal: true });
  };

  editOutputSignals() {
    this.setState({ editOutputSignalsModal: true });
  };

  closeEditSignalsModal(direction) {
    if (direction === "in") {
      this.setState({ editInputSignalsModal: false });
    } else if (direction === "out") {
      this.setState({ editOutputSignalsModal: false });
    }
  }


  render() {
    if (this.state.dashboard === undefined) {
      return <div className="section-title">  <span>{"Loading Dashboard..."}</span>  </div>
    }

    const buttonStyle = {
      marginLeft: '10px',
    }

    const iconStyle = {
      height: '25px',
      width: '25px'
    }

    const grid = this.state.dashboard.grid;
    const boxClasses = classNames('section', 'box', { 'fullscreen-padding': this.props.isFullscreen });
    let dropZoneHeight = this.state.dashboard.height;

    return (<div className={boxClasses} >
      <div key={"header-box"} className='section-header box-header'>
        <div key={"title"} className="section-title">
          <h2>
            {this.state.dashboard.name}
            <span key={"toggle-lock-button"} className='icon-button'>
              <IconToggleButton
                childKey={0}
                checked={this.state.locked}
                index={this.state.dashboard.id}
                checkedIcon='lock'
                uncheckedIcon='lock-open'
                tooltipChecked='Dashboard is locked, cannot be edited'
                tooltipUnchecked='Dashboard is unlocked, can be edited'
                disabled={true}
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
              />
            </span>
          </h2>
        </div>

        <DashboardButtonGroup
          key={"dashboard-buttons"}
          locked={this.state.locked}
          editing={this.state.editing}
          onEdit={this.startEditing.bind(this)}
          fullscreen={this.props.isFullscreen}
          paused={this.state.paused}
          onSave={this.saveEditing.bind(this)}
          onCancel={this.cancelEditing.bind(this)}
          onFullscreen={this.props.toggleFullscreen}
          onPause={this.pauseData.bind(this)}
          onUnpause={this.unpauseData.bind(this)}
          onEditFiles={this.startEditFiles.bind(this)}
          onEditOutputSignals={this.editOutputSignals.bind(this)}
          onEditInputSignals={this.editInputSignals.bind(this)}
        />
      </div>

      <div key={"dashboard-area"} className="box box-content" onContextMenu={(e) => e.preventDefault()}>
        {this.state.editing &&
          <WidgetToolbox
            key={"widget-toolbox"}
            grid={grid}
            onGridChange={this.setGrid.bind(this)}
            dashboard={this.state.dashboard}
            onDashboardSizeChange={this.setDashboardSize.bind(this)}
            widgets={this.state.widgets} />
        }

        <WidgetArea
          key={"widget-area"}
          widgets={this.state.widgets}
          editing={this.state.editing}
          dropZoneHeight={dropZoneHeight}
          grid={grid}
          onWidgetAdded={this.handleDrop.bind(this)}
        >
          {this.state.widgets != null && Object.keys(this.state.widgets).map(widgetKey => (

            <div key={"widget-container-wrapper" + widgetKey}>
              <WidgetContainer
                widget={this.state.widgets[widgetKey]}
                key={"widget-container" + widgetKey}
                index={parseInt(widgetKey, 10)}
                grid={grid}
                onWidgetChange={this.widgetChange.bind(this)}
                editing={this.state.editing}
                paused={this.state.paused}
                onEdit={this.editWidget.bind(this)}
                onDuplicate={this.duplicateWidget.bind(this)}
                onDelete={this.deleteWidget.bind(this)}
                onChange={this.state.editing ? this.widgetChange.bind(this) : this.onChange.bind(this)}
              >
                <Widget
                  key={"widget" + widgetKey}
                  data={this.state.widgets[widgetKey]}
                  editing={this.state.editing}
                  index={parseInt(widgetKey, 10)}
                  paused={this.state.paused}
                  ics={this.state.ics}
                />
              </WidgetContainer>

            </div>

          ))}
        </WidgetArea>

        <EditWidget
          key={"edit-widget"}
          sessionToken={this.state.sessionToken}
          show={this.state.editModal}
          onClose={this.closeEdit.bind(this)}
          widget={this.state.modalData}
          signals={this.state.signals}
          files={this.state.files}
          ics={this.state.ics}
        />

        <EditFilesDialog
          key={"edit-files-dialog"}
          sessionToken={this.state.sessionToken}
          show={this.state.filesEditModal}
          onClose={this.closeEditFiles.bind(this)}
          signals={this.state.signals}
          files={this.state.files}
          scenarioID={this.state.dashboard.scenarioID}
          locked={this.state.locked}
        />

        <EditSignalMappingDialog
          key={"edit-signal-mapping-output-dialog"}
          show={this.state.editOutputSignalsModal}
          onCloseEdit={(direction) => this.closeEditSignalsModal(direction)}
          direction="Output"
          signals={this.state.signals}
          configID={null}
          configs={this.state.configs}
          sessionToken={this.state.sessionToken}
        />
        <EditSignalMappingDialog
          key={"edit-signal-mapping-input-dialog"}
          show={this.state.editInputSignalsModal}
          onCloseEdit={(direction) => this.closeEditSignalsModal(direction)}
          direction="Input"
          signals={this.state.signals}
          configID={null}
          configs={this.state.configs}
          sessionToken={this.state.sessionToken}
        />
      </div>
    </div>);
  }
}


let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Fullscreenable()(Container.create(fluxContainerConverter.convert(Dashboard), { withProps: true }));
