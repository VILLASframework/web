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

import React from 'react';
import { Container } from 'flux/utils';
import { Button, InputGroup, FormControl, Tooltip, OverlayTrigger } from 'react-bootstrap';

import FileSaver from 'file-saver';

import ScenarioStore from './scenario-store';
import ICStore from '../ic/ic-store';
import DashboardStore from '../dashboard/dashboard-store';
import ConfigStore from '../componentconfig/config-store';
import SignalStore from '../signal/signal-store'
import AppDispatcher from '../common/app-dispatcher';

import Icon from '../common/icon';
import Table from '../common/table';
import TableColumn from '../common/table-column';
import ImportConfigDialog from '../componentconfig/import-config';
import ImportDashboardDialog from "../dashboard/import-dashboard";
import NewDashboardDialog from "../dashboard/new-dashboard";
import EditDashboardDialog from '../dashboard/edit-dashboard';
import EditFiles from '../file/edit-files'
import NewResultDialog from '../result/new-result';
import EditResultDialog from '../result/edit-result';
import ResultConfigDialog from '../result/result-configs-dialog';


import ICAction from '../ic/ic-action';
import DeleteDialog from '../common/dialogs/delete-dialog';
import EditConfigDialog from "../componentconfig/edit-config";
import EditSignalMapping from "../signal/edit-signal-mapping";
import FileStore from "../file/file-store"
import WidgetStore from "../widget/widget-store";
import ResultStore from "../result/result-store"
import { Redirect } from 'react-router-dom';
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";

var JSZip = require("jszip");

class Scenario extends React.Component {

  static getStores() {
    return [ScenarioStore, ConfigStore, DashboardStore, ICStore, SignalStore, FileStore, WidgetStore, ResultStore];
  }

  static calculateState(prevState, props) {
    if (prevState == null) {
      prevState = {};
    }
    // get selected scenario
    const sessionToken = localStorage.getItem("token");

    const scenario = ScenarioStore.getState().find(s => s.id === parseInt(props.match.params.scenario, 10));
    if (scenario === undefined) {
      AppDispatcher.dispatch({
        type: 'scenarios/start-load',
        data: props.match.params.scenario,
        token: sessionToken
      });
    }

    // obtain all component configurations of a scenario
    let configs = ConfigStore.getState().filter(config => config.scenarioID === parseInt(props.match.params.scenario, 10));
    let editConfigModal = prevState.editConfigModal || false;
    let modalConfigData = (prevState.modalConfigData !== {} && prevState.modalConfigData !== undefined) ? prevState.modalConfigData : {};
    let modalConfigIndex = 0;

    if ((typeof prevState.configs !== "undefined") && (prevState.newConfig === true) && (configs.length !== prevState.configs.length)) {
      let index = configs.length - 1;
      editConfigModal = true;
      modalConfigData = configs[index];
      modalConfigIndex = index;
    }

    let results = ResultStore.getState().filter(result => result.scenarioID === parseInt(props.match.params.scenario, 10));

    return {
      scenario,
      results,
      sessionToken,
      configs,
      editConfigModal,
      modalConfigData,
      modalConfigIndex,
      dashboards: DashboardStore.getState().filter(dashb => dashb.scenarioID === parseInt(props.match.params.scenario, 10)),
      signals: SignalStore.getState(),
      currentUser: JSON.parse(localStorage.getItem("currentUser")),
      files: FileStore.getState().filter(file => file.scenarioID === parseInt(props.match.params.scenario, 10)),

      ics: ICStore.getState(),
      ExternalICInUse: false,

      deleteConfigModal: false,
      importConfigModal: false,
      newConfig: prevState.newConfig || false,
      selectedConfigs: [],
      filesEditModal: prevState.filesEditModal || false,
      filesEditSaveState: prevState.filesEditSaveState || [],

      editResultsModal: prevState.editResultsModal || false,
      modalResultsData: {},
      modalResultsIndex: prevState.modalResultsIndex,
      newResultModal: false,
      filesToDownload: prevState.filesToDownload,
      zipfiles: prevState.zipfiles || false,
      resultNodl: prevState.resultNodl,
      resultConfigsModal: false,
      modalResultConfigs: {},
      modalResultConfigsIndex: 0,

      editOutputSignalsModal: prevState.editOutputSignalsModal || false,
      editInputSignalsModal: prevState.editInputSignalsModal || false,

      newDashboardModal: false,
      dashboardEditModal: prevState.dashboardEditModal || false,
      deleteDashboardModal: false,
      importDashboardModal: false,
      modalDashboardData: {},

      userToAdd: '',
      deleteUserName: '',
      deleteUserModal: false,
      goToScenarios: false
    }
  }

  componentDidMount() {

    //load selected scenario
    AppDispatcher.dispatch({
      type: 'scenarios/start-load',
      data: parseInt(this.props.match.params.scenario, 10),
      token: this.state.sessionToken
    });


    AppDispatcher.dispatch({
      type: 'scenarios/start-load-users',
      data: parseInt(this.props.match.params.scenario, 10),
      token: this.state.sessionToken
    });

    // load ICs to enable that component configs and dashboards work with them
    AppDispatcher.dispatch({
      type: 'ics/start-load',
      token: this.state.sessionToken
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // check whether file data has been loaded
    if (this.state.filesToDownload && this.state.filesToDownload.length > 0) {
      if (this.state.files != prevState.files) {
        if (!this.state.zipfiles) {
          let fileToDownload = FileStore.getState().filter(file => file.id === this.state.filesToDownload[0])
          if (fileToDownload.length === 1 && fileToDownload[0].data) {
            const blob = new Blob([fileToDownload[0].data], { type: fileToDownload[0].type });
            FileSaver.saveAs(blob, fileToDownload[0].name);
            this.setState({ filesToDownload: [] });
          }
        } else { // zip and save one or more files (download all button)
          let filesToDownload = FileStore.getState().filter(file => this.state.filesToDownload.includes(file.id) && file.data);
          if (filesToDownload.length === this.state.filesToDownload.length) { // all requested files have been loaded
            var zip = new JSZip();
            filesToDownload.forEach(file => {
              zip.file(file.name, file.data);
            });
            let zipname = "result_" + this.state.resultNodl + "_" + (new Date()).toISOString();
            zip.generateAsync({ type: "blob" }).then(function (content) {
              saveAs(content, zipname);
            });
            this.setState({ filesToDownload: [] });
          }
        }
      }
    }
  }

  /* ##############################################
  * User modification methods
  ############################################## */

  onUserInputChange(e) {
    this.setState({ userToAdd: e.target.value });
  }

  addUser() {
    AppDispatcher.dispatch({
      type: 'scenarios/add-user',
      data: this.state.scenario.id,
      username: this.state.userToAdd,
      token: this.state.sessionToken
    });

    this.setState({ userToAdd: '' });
  }

  closeDeleteUserModal() {
    let scenarioID = this.state.scenario.id;
    if (this.state.deleteUserName === this.state.currentUser.username) {
      AppDispatcher.dispatch({
        type: 'scenarios/remove-user',
        data: scenarioID,
        username: this.state.deleteUserName,
        token: this.state.sessionToken,
        ownuser: true
      });
      this.setState({ goToScenarios: true });
    } else {
      AppDispatcher.dispatch({
        type: 'scenarios/remove-user',
        data: scenarioID,
        username: this.state.deleteUserName,
        token: this.state.sessionToken,
        ownuser: false
      });
    }
    this.setState({ deleteUserModal: false });
  }

  /* ##############################################
  * Component Configuration modification methods
  ############################################## */

  addConfig() {
    const config = {
      scenarioID: this.state.scenario.id,
      name: 'New Component Configuration',
      icID: this.state.ics.length > 0 ? this.state.ics[0].id : null,
      startParameters: {},
    };

    AppDispatcher.dispatch({
      type: 'configs/start-add',
      data: config,
      token: this.state.sessionToken
    });

    this.setState({ newConfig: true });

  }

  closeEditConfigModal(data) {
    this.setState({ editConfigModal: false, newConfig: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'configs/start-edit',
        data: data,
        token: this.state.sessionToken,
      });
    }
  }

  closeDeleteConfigModal(confirmDelete) {
    this.setState({ deleteConfigModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'configs/start-remove',
      data: this.state.modalConfigData,
      token: this.state.sessionToken
    });
  }

  importConfig(data) {
    this.setState({ importConfigModal: false });

    if (data == null) {
      return;
    }

    let newConfig = JSON.parse(JSON.stringify(data.config))

    newConfig["scenarioID"] = this.state.scenario.id;
    newConfig.name = data.name;

    AppDispatcher.dispatch({
      type: 'configs/start-add',
      data: newConfig,
      token: this.state.sessionToken
    });
  }

  copyConfig(index) {
    let config = JSON.parse(JSON.stringify(this.state.configs[index]));

    let signals = JSON.parse(JSON.stringify(SignalStore.getState().filter(s => s.configID === parseInt(config.id, 10))));
    signals.forEach((signal) => {
      delete signal.configID;
      delete signal.id;
    })

    // two separate lists for inputMapping and outputMapping
    let inputSignals = signals.filter(s => s.direction === 'in');
    let outputSignals = signals.filter(s => s.direction === 'out');

    // add signal mappings to config
    config["inputMapping"] = inputSignals;
    config["outputMapping"] = outputSignals;

    delete config.id;
    delete config.scenarioID;
    delete config.inputLength;
    delete config.outputLength;

    return config;
  }

  exportConfig(index) {
    let config = this.copyConfig(index);

    // show save dialog
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'config-' + config.name + '.json');
  }

  duplicateConfig(index) {
    let newConfig = this.copyConfig(index);
    newConfig["scenarioID"] = this.state.scenario.id;
    newConfig.name = newConfig.name + '_copy';

    AppDispatcher.dispatch({
      type: 'configs/start-add',
      data: newConfig,
      token: this.state.sessionToken
    });
  }

  onConfigChecked(index, event) {
    const selectedConfigs = Object.assign([], this.state.selectedConfigs);
    for (let key in selectedConfigs) {
      if (selectedConfigs[key] === index) {
        // update existing entry
        if (event.target.checked) {
          return;
        }

        selectedConfigs.splice(key, 1);

        this.setState({ selectedConfigs: selectedConfigs });
        return;
      }
    }

    // add new entry
    if (event.target.checked === false) {
      return;
    }

    selectedConfigs.push(index);
    this.setState({ selectedConfigs: selectedConfigs });
  }

  usesExternalIC(index) {
    let icID = this.state.configs[index].icID;

    let ic = null;
    for (let component of this.state.ics) {
      if (component.id === icID) {
        ic = component;
      }
    }

    if (ic == null) {
      return false;
    }

    if (ic.managedexternally === true) {
      this.setState({ ExternalICInUse: true })
      return true
    }

    return false
  }

  getICName(icID) {
    for (let ic of this.state.ics) {
      if (ic.id === icID) {
        return ic.name || ic.uuid;
      }
    }
  }

  /* ##############################################
  * Dashboard modification methods
  ############################################## */

  closeNewDashboardModal(data) {
    this.setState({ newDashboardModal: false });
    if (data) {
      // TODO: 'newDashboard' not used, check this
      let newDashboard = data;
      // add default grid value and scenarioID
      newDashboard["grid"] = 15;
      newDashboard["scenarioID"] = this.state.scenario.id;

      AppDispatcher.dispatch({
        type: 'dashboards/start-add',
        data,
        token: this.state.sessionToken,
      });
    }
  }

  closeEditDashboardModal(data) {
    this.setState({ dashboardEditModal: false });

    let editDashboard = this.state.modalDashboardData;

    if (data != null) {
      editDashboard.name = data.name;
      AppDispatcher.dispatch({
        type: 'dashboards/start-edit',
        data: editDashboard,
        token: this.state.sessionToken
      });
    }
  }

  closeDeleteDashboardModal(confirmDelete) {
    this.setState({ deleteDashboardModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'dashboards/start-remove',
      data: this.state.modalDashboardData,
      token: this.state.sessionToken,
    });
  }

  closeImportDashboardModal(data) {
    this.setState({ importDashboardModal: false });

    if (data) {
      let newDashboard = JSON.parse(JSON.stringify(data));
      newDashboard["scenarioID"] = this.state.scenario.id;

      AppDispatcher.dispatch({
        type: 'dashboards/start-add',
        data: newDashboard,
        token: this.state.sessionToken,
      });
    }
  }

  copyDashboard(index) {
    let dashboard = JSON.parse(JSON.stringify(this.state.dashboards[index]));

    let widgets = JSON.parse(JSON.stringify(WidgetStore.getState().filter(w => w.dashboardID === parseInt(dashboard.id, 10))));
    widgets.forEach((widget) => {
      delete widget.dashboardID;
      delete widget.id;
    })
    dashboard["widgets"] = widgets;
    delete dashboard.scenarioID;
    delete dashboard.id;

    return dashboard;
  }

  exportDashboard(index) {
    let dashboard = this.copyDashboard(index);

    // show save dialog
    const blob = new Blob([JSON.stringify(dashboard, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'dashboard - ' + dashboard.name + '.json');
  }

  duplicateDashboard(index) {
    let newDashboard = this.copyDashboard(index);
    newDashboard.scenarioID = this.state.scenario.id;
    newDashboard.name = newDashboard.name + '_copy';

    AppDispatcher.dispatch({
      type: 'dashboards/start-add',
      data: newDashboard,
      token: this.state.sessionToken,
    });
  }

  /* ##############################################
  * Signal modification methods
  ############################################## */

  closeEditSignalsModal(direction) {

    // reload the config
    AppDispatcher.dispatch({
      type: 'configs/start-load',
      data: this.state.modalConfigData.id,
      token: this.state.sessionToken
    });

    if (direction === "in") {
      this.setState({ editInputSignalsModal: false });
    } else if (direction === "out") {
      this.setState({ editOutputSignalsModal: false });
    }


  }

  onEditFiles() {
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
    this.setState({ filesEditModal: false });
    // TODO do we need this if the dispatches happen in the dialog?
  }

  signalsAutoConf(index) {
    let componentConfig = this.state.configs[index];
    // determine apiurl of infrastructure component
    let ic = this.state.ics.find(ic => ic.id === componentConfig.icID)
    if (!ic.type.includes("villas-node")) {
      let message = "Cannot autoconfigure signals for IC type " + ic.type + " of category " + ic.category + ". This is only possible for gateway ICs of type 'VILLASnode'."
      console.warn(message);

      const SIGNAL_AUTOCONF_WARN_NOTIFICATION = {
        title: 'Failed to load signal config for IC ' + ic.name,
        message: message,
        level: 'warning'
      };
      NotificationsDataManager.addNotification(SIGNAL_AUTOCONF_WARN_NOTIFICATION);
      return;
    }

    let splitWebsocketURL = ic.websocketurl.split("/")

    AppDispatcher.dispatch({
      type: 'signals/start-autoconfig',
      url: ic.apiurl + "/nodes",
      socketname: splitWebsocketURL[splitWebsocketURL.length - 1],
      token: this.state.sessionToken,
      configID: componentConfig.id
    });

  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // eslint-disable-next-line
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /* ##############################################
  * File modification methods
  ############################################## */

  getListOfFiles(fileIDs, types) {

    let fileList = '';

    for (let id of fileIDs) {
      for (let file of this.state.files) {
        if (file.id === id && types.some(e => file.type.includes(e))) {
          if (fileList === '') {
            fileList = file.name
          } else {
            fileList = fileList + ';' + file.name;
          }
        }
      }
    }
    return fileList;
  }

  /* ##############################################
  * Result modification methods
  ############################################## */

  closeNewResultModal(data) {
    this.setState({ newResultModal: false });
    if (data) {
      data["scenarioID"] = this.state.scenario.id;
      AppDispatcher.dispatch({
        type: 'results/start-add',
        data,
        token: this.state.sessionToken,
      });
    }
  }

  closeEditResultsModal() {
    this.setState({ editResultsModal: false });
  }

  downloadResultData(param) {
    let toDownload = [];
    let zip = false;

    if (typeof (param) === 'object') { // download all files
      toDownload = param.resultFileIDs;
      zip = true;
      this.setState({ filesToDownload: toDownload, zipfiles: zip, resultNodl: param.id });
    } else { // download one file
      toDownload.push(param);
      this.setState({ filesToDownload: toDownload, zipfiles: zip });
    }

    toDownload.forEach(fileid => {
      AppDispatcher.dispatch({
        type: 'files/start-download',
        data: fileid,
        token: this.state.sessionToken
      });
    });
  }

  closeDeleteResultsModal(confirmDelete) {
    this.setState({ deleteResultsModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'results/start-remove',
      data: this.state.modalResultsData,
      token: this.state.sessionToken,
    });
  }

  openResultConfigSnaphots(result) {
    if (result.configSnapshots === null || result.configSnapshots === undefined) {
      this.setState({
        modalResultConfigs: {"configs": []},
        modalResultConfigsIndex: result.id,
        resultConfigsModal: true
      });
    } else {
      this.setState({
        modalResultConfigs: result.configSnapshots,
        modalResultConfigsIndex: result.id,
        resultConfigsModal: true
      });
    }
  }

  closeResultConfigSnapshots() {
    this.setState({ resultConfigsModal: false });
  }

  modifyResultNoColumn(id, result) {
    return <Button variant="link" style={{ color: '#047cab' }} onClick={() => this.openResultConfigSnaphots(result)}>{id}</Button>
  }

  startPintura(configIndex) {
    let config = this.state.configs[configIndex];

    // get xml / CIM file
    let files = []
    for (let id of config.fileIDs) {
      for (let file of this.state.files) {
        if (file.id === id && ['xml'].some(e => file.type.includes(e))) {
          files.push(file);
        }
      }
    }

    if (files.length > 1) {
      // more than one CIM file...
      console.warn("There is more than one CIM file selected in this component configuration. I will open them all in a separate tab.")
    }

    let baseURL = 'aaa.bbb.ccc.ddd/api/v2/files/'
    for (let file of files) {
      // endpoint param serves for download and upload of CIM file, token is required for authentication
      let params = {
        token: this.state.sessionToken,
        endpoint: baseURL + String(file.id),
      }

      // TODO start Pintura for editing CIM/ XML file from here
      console.warn("Starting Pintura... and nothing happens so far :-) ", params)
    }
  }


  /* ##############################################
  * Render method
  ############################################## */

  render() {
    if (this.state.goToScenarios) {
      console.log("redirect to scenario overview")
      return (<Redirect to="/scenarios" />);
    }

    const altButtonStyle = {
      marginLeft: '10px',
    }

    const tableHeadingStyle = {
      paddingTop: '30px'
    }

    const iconStyle = {
      height: '30px',
      width: '30px'
    }

    if (this.state.scenario === undefined) {
      return <h1>Loading Scenario...</h1>;
    }

    let resulttable;
    if (this.state.results && this.state.results.length > 0) {
      resulttable = <div>
        <Table data={this.state.results}>
          <TableColumn
            title='Result No.'
            dataKey='id'
            modifier={(id, result) => this.modifyResultNoColumn(id, result)}
          />
          <TableColumn title='Description' dataKey='description' />
          <TableColumn title='Created at' dataKey='createdAt' />
          <TableColumn title='Last update' dataKey='updatedAt' />
          <TableColumn
            title='Files/Data'
            dataKey='resultFileIDs'
            linkKey='filebuttons'
            data={this.state.files}
            width='300'
            onDownload={(index) => this.downloadResultData(index)}
          />
          <TableColumn
            title='Options'
            width='300'
            editButton
            downloadAllButton
            deleteButton
            onEdit={index => this.setState({ editResultsModal: true, modalResultsIndex: index })}
            onDownloadAll={(index) => this.downloadResultData(this.state.results[index])}
            onDelete={(index) => this.setState({ deleteResultsModal: true, modalResultsData: this.state.results[index], modalResultsIndex: index })}
          />
        </Table>

        <EditResultDialog
          sessionToken={this.state.sessionToken}
          show={this.state.editResultsModal}
          files={this.state.files}
          results={this.state.results}
          resultId={this.state.modalResultsIndex}
          scenarioID={this.state.scenario.id}
          onClose={this.closeEditResultsModal.bind(this)} />
        <DeleteDialog title="result" name={this.state.modalResultsData.id} show={this.state.deleteResultsModal} onClose={(e) => this.closeDeleteResultsModal(e)} />
        <ResultConfigDialog
          show={this.state.resultConfigsModal}
          configs={this.state.modalResultConfigs}
          resultNo={this.state.modalResultConfigsIndex}
          onClose={this.closeResultConfigSnapshots.bind(this)}
        />
      </div>
    }

    return <div className='section'>
      <div className='section-buttons-group-right'>
        <OverlayTrigger key={0} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"file"}`}> Add, edit or delete files of scenario </Tooltip>} >
          <Button variant='light' key={0} size="lg" onClick={this.onEditFiles.bind(this)}>
            <Icon icon="file" classname={'icon-color'} style={iconStyle}/>
          </Button>
        </OverlayTrigger>
      </div>
      <h1>{this.state.scenario.name}</h1>

      <EditFiles
        sessionToken={this.state.sessionToken}
        show={this.state.filesEditModal}
        onClose={this.closeEditFiles.bind(this)}
        signals={this.state.signals}
        files={this.state.files}
        scenarioID={this.state.scenario.id}
      />

      {/*Component Configurations table*/}
      <h2 style={tableHeadingStyle}>Component Configurations
        <span className='icon-button'>
        <OverlayTrigger
          key={1}
          placement={'top'}
          overlay={<Tooltip id={`tooltip-${"add"}`}> Add Component Configuration </Tooltip>} >
          <Button variant='light' onClick={() => this.addConfig()} style={altButtonStyle}><Icon icon="plus"  classname={'icon-color'} style={iconStyle} /></Button>
        </OverlayTrigger>
        <OverlayTrigger
          key={2}
          placement={'top'}
          overlay={<Tooltip id={`tooltip-${"import"}`}> Import Component Configuration </Tooltip>} >
          <Button variant='light' onClick={() => this.setState({ importConfigModal: true })} style={altButtonStyle}><Icon icon="upload" classname={'icon-color'} style={iconStyle}/></Button>
        </OverlayTrigger>
          </span>
      </h2>
      <Table data={this.state.configs}>
        <TableColumn
          checkbox
          checkboxDisabled={(index) => !this.usesExternalIC(index)}
          onChecked={(index, event) => this.onConfigChecked(index, event)}
          width='30' />
        <TableColumn title='Name' dataKey='name' />
        <TableColumn title='Configuration file(s)' dataKey='fileIDs' modifier={(fileIDs) => this.getListOfFiles(fileIDs, ['json', 'JSON'])} />
        <TableColumn
          title='Model file(s)'
          dataKey='fileIDs'
          modifier={(fileIDs) => this.getListOfFiles(fileIDs, ['xml'])}
          editButton
          onEdit={(index) => this.startPintura(index)}
        />
        <TableColumn
          title='# Output Signals'
          dataKey='outputLength'
          editButton
          onEdit={index => this.setState({ editOutputSignalsModal: true, modalConfigData: this.state.configs[index], modalConfigIndex: index })}
        />
        <TableColumn
          title='# Input Signals'
          dataKey='inputLength'
          editButton
          onEdit={index => this.setState({ editInputSignalsModal: true, modalConfigData: this.state.configs[index], modalConfigIndex: index })}
        />
        <TableColumn
          title='Signal AutoConf'
          exportButton
          onExport={(index) => this.signalsAutoConf(index)}
        />
        <TableColumn title='Infrastructure Component' dataKey='icID' modifier={(icID) => this.getICName(icID)} />
        <TableColumn
          title=''
          width='200'
          editButton
          deleteButton
          exportButton
          duplicateButton
          onEdit={index => this.setState({ editConfigModal: true, modalConfigData: this.state.configs[index], modalConfigIndex: index })}
          onDelete={(index) => this.setState({ deleteConfigModal: true, modalConfigData: this.state.configs[index], modalConfigIndex: index })}
          onExport={index => this.exportConfig(index)}
          onDuplicate={index => this.duplicateConfig(index)}
        />
      </Table>

      {this.state.ExternalICInUse ?
        <div style={{ float: 'left' }}>
          <ICAction
            ics={this.state.ics}
            configs={this.state.configs}
            selectedConfigs = {this.state.selectedConfigs}
            snapshotConfig = {(index) => this.copyConfig(index)}
            token = {this.state.sessionToken}
            actions={[
              { id: '0', title: 'Start', data: { action: 'start' } },
              { id: '1', title: 'Stop', data: { action: 'stop' } },
              { id: '2', title: 'Pause', data: { action: 'pause' } },
              { id: '3', title: 'Resume', data: { action: 'resume' } }
            ]} />
        </div>
        : <div />
      }

      < div style={{ clear: 'both' }} />

      <EditConfigDialog
        show={this.state.editConfigModal}
        onClose={data => this.closeEditConfigModal(data)}
        config={this.state.modalConfigData}
        ics={this.state.ics}
        files={this.state.files}
        sessionToken={this.state.sessionToken}
      />

      <ImportConfigDialog show={this.state.importConfigModal} onClose={data => this.importConfig(data)} ics={this.state.ics} />
      <DeleteDialog title="component configuration" name={this.state.modalConfigData.name} show={this.state.deleteConfigModal} onClose={(c) => this.closeDeleteConfigModal(c)} />

      <EditSignalMapping
        show={this.state.editOutputSignalsModal}
        onCloseEdit={(direction) => this.closeEditSignalsModal(direction)}
        direction="Output"
        signals={this.state.signals}
        configID={this.state.modalConfigData.id}
        sessionToken={this.state.sessionToken}
      />
      <EditSignalMapping
        show={this.state.editInputSignalsModal}
        onCloseEdit={(direction) => this.closeEditSignalsModal(direction)}
        direction="Input"
        signals={this.state.signals}
        configID={this.state.modalConfigData.id}
        sessionToken={this.state.sessionToken}
      />

      {/*Dashboard table*/}
      <h2 style={tableHeadingStyle}>Dashboards
        <span className='icon-button'>
        <OverlayTrigger
          key={1}
          placement={'top'}
          overlay={<Tooltip id={`tooltip-${"add"}`}> Add Dashboard </Tooltip>} >
          <Button variant='light' onClick={() => this.setState({ newDashboardModal: true })} style={altButtonStyle}><Icon icon="plus" classname={'icon-color'} style={iconStyle} /></Button>
        </OverlayTrigger>
        <OverlayTrigger
          key={2}
          placement={'top'}
          overlay={<Tooltip id={`tooltip-${"import"}`}> Import Dashboard </Tooltip>} >
          <Button variant='light' onClick={() => this.setState({ importDashboardModal: true })} style={altButtonStyle}><Icon icon="upload" classname={'icon-color'} style={iconStyle} /></Button>
        </OverlayTrigger>
          </span>
      </h2>
      <Table data={this.state.dashboards}>
        <TableColumn title='Name' dataKey='name' link='/dashboards/' linkKey='id' />
        <TableColumn title='Grid' dataKey='grid' />
        <TableColumn
          title=''
          width='200'
          editButton
          deleteButton
          exportButton
          duplicateButton
          onEdit={index => this.setState({ dashboardEditModal: true, modalDashboardData: this.state.dashboards[index] })}
          onDelete={(index) => this.setState({ deleteDashboardModal: true, modalDashboardData: this.state.dashboards[index], modalDashboardIndex: index })}
          onExport={index => this.exportDashboard(index)}
          onDuplicate={index => this.duplicateDashboard(index)}
        />
      </Table>

      <NewDashboardDialog show={this.state.newDashboardModal} onClose={data => this.closeNewDashboardModal(data)} />
      <EditDashboardDialog show={this.state.dashboardEditModal} dashboard={this.state.modalDashboardData} onClose={data => this.closeEditDashboardModal(data)} />
      <ImportDashboardDialog show={this.state.importDashboardModal} onClose={data => this.closeImportDashboardModal(data)} />

      <DeleteDialog title="dashboard" name={this.state.modalDashboardData.name} show={this.state.deleteDashboardModal} onClose={(e) => this.closeDeleteDashboardModal(e)} />

      {/*Result table*/}
      <h2 style={tableHeadingStyle}>Results
        <span className='icon-button'>
        <OverlayTrigger
          key={1}
          placement={'top'}
          overlay={<Tooltip id={`tooltip-${"add"}`}> Add Result </Tooltip>} >
          <Button variant='light' onClick={() => this.setState({ newResultModal: true })} style={altButtonStyle}><Icon icon="plus" classname={'icon-color'} style={iconStyle} /></Button>
        </OverlayTrigger>
          </span>
      </h2>
      {resulttable}
      <NewResultDialog show={this.state.newResultModal} onClose={data => this.closeNewResultModal(data)} />

      {/*Scenario Users table*/}
      <h2 style={tableHeadingStyle}>Users sharing this scenario</h2>
      <div>
        <Table data={this.state.scenario.users}>
          <TableColumn title='Name' dataKey='username' />
          <TableColumn title='Mail' dataKey='mail' />
          <TableColumn
            title=''
            width='200'
            deleteButton
            onDelete={(index) => this.setState({ deleteUserModal: true, deleteUserName: this.state.scenario.users[index].username, modalUserIndex: index })}
          />
        </Table>

        <InputGroup style={{ width: 400, float: 'right' }}>
          <FormControl
            placeholder="Username"
            onChange={(e) => this.onUserInputChange(e)}
            value={this.state.userToAdd}
            type="text"
          />
          <InputGroup.Append>
          <span className='icon-button'>
            <Button
              variant='light'
              type="submit"
              style={altButtonStyle}
              onClick={() => this.addUser()}>
              <Icon icon="plus" classname={'icon-color'} style={iconStyle} />
            </Button>
            </span>
          </InputGroup.Append>
        </InputGroup><br /><br />
      </div>

      <DeleteDialog title="user from scenario:" name={this.state.deleteUserName} show={this.state.deleteUserModal} onClose={(c) => this.closeDeleteUserModal(c)} />


    </div>;
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Scenario), { withProps: true });
