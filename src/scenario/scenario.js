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

import ICAction from '../ic/ic-action';
import DeleteDialog from '../common/dialogs/delete-dialog';
import EditConfigDialog from "../componentconfig/edit-config";
import EditSignalMapping from "../signal/edit-signal-mapping";
import FileStore from "../file/file-store"
import WidgetStore from "../widget/widget-store";
import { Redirect } from 'react-router-dom';

class Scenario extends React.Component {

  static getStores() {
    return [ ScenarioStore, ConfigStore, DashboardStore, ICStore, SignalStore, FileStore, WidgetStore];
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
    let modalConfigData = (prevState.modalConfigData !== {} && prevState.modalConfigData !== undefined )? prevState.modalConfigData : {};
    let modalConfigIndex = 0;

    if((typeof prevState.configs !== "undefined") && (prevState.newConfig === true ) && (configs.length !== prevState.configs.length)){
      let index = configs.length -1;
      editConfigModal = true;
      modalConfigData = configs[index];
      modalConfigIndex = index;
    }

    return {
      scenario,
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

      deleteConfigModal: false,
      importConfigModal: false,
      newConfig: prevState.newConfig || false,
      selectedConfigs: [],
      filesEditModal: prevState.filesEditModal || false,
      filesEditSaveState: prevState.filesEditSaveState || [],

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

  /* ##############################################
  * User modification methods
  ############################################## */

  onUserInputChange(e) {
    this.setState({userToAdd: e.target.value});
  }

  addUser() {
    AppDispatcher.dispatch({
      type: 'scenarios/add-user',
      data: this.state.scenario.id,
      username: this.state.userToAdd,
      token: this.state.sessionToken
    });

    this.setState({userToAdd: ''});
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

    this.setState({newConfig: true});

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

  exportConfig(index) {
    // filter properties
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

    // show save dialog
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'config-' + config.name + '.json');
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

  runAction(action) {

    if(action.data.action === 'none'){
      console.warn("No command selected. Nothing was sent.");
      return;
    }

    for (let index of this.state.selectedConfigs) {
      // get IC for component config
      let ic = null;
      for (let component of this.state.ics) {
        if (component.id === this.state.configs[index].icID) {
          ic = component;
        }
      }

      if (ic == null) {
        continue;
      }

      if (action.data.action === 'start') {
        action.data.parameters = this.state.configs[index].startParameters;
      }

      AppDispatcher.dispatch({
        type: 'ics/start-action',
        ic: ic,
        data: action.data,
        token: this.state.sessionToken
      });
    }
  };

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

  exportDashboard(index) {
    // filter properties
    let dashboard = JSON.parse(JSON.stringify(this.state.dashboards[index]));

    let widgets = JSON.parse(JSON.stringify(WidgetStore.getState().filter(w => w.dashboardID === parseInt(dashboard.id, 10))));
    widgets.forEach((widget) => {
      delete widget.dashboardID;
      delete widget.id;
    })
    dashboard["widgets"] = widgets;
    delete dashboard.scenarioID;
    delete dashboard.id;

    // show save dialog
    const blob = new Blob([JSON.stringify(dashboard, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'dashboard - ' + dashboard.name + '.json');
  }

  /* ##############################################
  * Signal modification methods
  ############################################## */

  closeEditSignalsModal(direction){
    if( direction === "in") {
      this.setState({editInputSignalsModal: false});
    } else if( direction === "out"){
      this.setState({editOutputSignalsModal: false});
    }
  }

  onEditFiles(){
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
    // TODO do we need this if the dispatches happen in the dialog?
  }

  /* ##############################################
  * File modification methods
  ############################################## */

  getListOfFiles(fileIDs, types) {

    let fileList = '';

    for (let id of fileIDs){
      for (let file of this.state.files) {
        if (file.id === id && types.some(e => file.type.includes(e))) {
          if (fileList === ''){
            fileList = file.name
          } else {
            fileList = fileList + ';' + file.name;
          }
        }
      }
    }
    return fileList;
  }

  startPintura(configIndex){
    let config = this.state.configs[configIndex];

    // get xml / CIM file
    let files = []
    for (let id of config.fileIDs){
      for (let file of this.state.files) {
        if (file.id === id && ['xml'].some(e => file.type.includes(e))) {
          files.push(file);
        }
      }
    }

    if(files.length > 1){
      // more than one CIM file...
      console.warn("There is more than one CIM file selected in this component configuration. I will open them all in a separate tab.")
    }

    let base_host = 'aaa.bbb.ccc.ddd/api/v2/files/'
    for (let file of files) {
      // endpoint param serves for download and upload of CIM file, token is required for authentication
      let params = {
        token: this.state.sessionToken,
        endpoint: base_host + String(file.id),
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

    const buttonStyle = {
      marginLeft: '10px'
    };

    const tableHeadingStyle = {
      paddingTop: '30px'
    }

    const iconStyle = {
      color: '#007bff',
      height: '25px',
      width : '25px'
    }

    if(this.state.scenario === undefined){
      return <h1>Loading Scenario...</h1>;
    }

    return <div className='section'>
      <div className='section-buttons-group-right'>
      <OverlayTrigger key={0} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"file"}`}> Add, edit or delete files of scenario </Tooltip>} >
        <Button key={0} variant= 'light' size="lg" onClick={this.onEditFiles.bind(this)} style={buttonStyle}>
          <Icon icon="file" style= {iconStyle}/>
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
      <h2 style={tableHeadingStyle}>Component Configurations</h2>
      <Table data={this.state.configs}>
        <TableColumn checkbox onChecked={(index, event) => this.onConfigChecked(index, event)} width='30' />
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
        <TableColumn title='Infrastructure Component' dataKey='icID' modifier={(icID) => this.getICName(icID)} />
        <TableColumn
          title=''
          width='200'
          editButton
          deleteButton
          exportButton
          onEdit={index => this.setState({ editConfigModal: true, modalConfigData: this.state.configs[index], modalConfigIndex: index })}
          onDelete={(index) => this.setState({ deleteConfigModal: true, modalConfigData: this.state.configs[index], modalConfigIndex: index })}
          onExport={index => this.exportConfig(index)}
        />
      </Table>

      <div style={{ float: 'left' }}>
        <ICAction
          runDisabled={this.state.selectedConfigs.length === 0}
          runAction={(action) => this.runAction(action)}
          actions={[
            { id: '-1', title: 'Select command', data: { action: 'none' } },
            { id: '0', title: 'Start', data: { action: 'start' } },
            { id: '1', title: 'Stop', data: { action: 'stop' } },
            { id: '2', title: 'Pause', data: { action: 'pause' } },
            { id: '3', title: 'Resume', data: { action: 'resume' } }
          ]} />
      </div>

      <div style={{ float: 'right' }}>
        <Button onClick={() => this.addConfig()} style={buttonStyle}><Icon icon="plus" /> Component Configuration</Button>
        <Button onClick={() => this.setState({ importConfigModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>
      </div>

      <div style={{ clear: 'both' }} />

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
      <h2 style={tableHeadingStyle}>Dashboards</h2>
      <Table data={this.state.dashboards}>
        <TableColumn title='Name' dataKey='name' link='/dashboards/' linkKey='id' />
        <TableColumn title='Grid' dataKey='grid' />
        <TableColumn
          title=''
          width='200'
          editButton
          deleteButton
          exportButton
          onEdit={index => this.setState({ dashboardEditModal: true, modalDashboardData: this.state.dashboards[index] })}
          onDelete={(index) => this.setState({ deleteDashboardModal: true, modalDashboardData: this.state.dashboards[index], modalDashboardIndex: index })}
          onExport={index => this.exportDashboard(index)}
        />
      </Table>

      <div style={{ float: 'right' }}>
        <Button onClick={() => this.setState({ newDashboardModal: true })} style={buttonStyle}><Icon icon="plus" /> Dashboard</Button>
        <Button onClick={() => this.setState({ importDashboardModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>
      </div>

      <div style={{ clear: 'both' }} />

      <NewDashboardDialog show={this.state.newDashboardModal} onClose={data => this.closeNewDashboardModal(data)} />
      <EditDashboardDialog show={this.state.dashboardEditModal} dashboard={this.state.modalDashboardData} onClose={data => this.closeEditDashboardModal(data)} />
      <ImportDashboardDialog show={this.state.importDashboardModal} onClose={data => this.closeImportDashboardModal(data)} />

      <DeleteDialog title="dashboard" name={this.state.modalDashboardData.name} show={this.state.deleteDashboardModal} onClose={(e) => this.closeDeleteDashboardModal(e)} />


      {/*Scenario Users table*/}
      <h2 style={tableHeadingStyle}>Users sharing this scenario</h2>
      <div>
        <Table data={this.state.scenario.users}>
          <TableColumn title='Name' dataKey='username'/>
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
            <Button
              type="submit"
              onClick={() => this.addUser()}>
              Add User
            </Button>
          </InputGroup.Append>
        </InputGroup><br/><br/>
      </div>

      <DeleteDialog title="user from scenario:" name={this.state.deleteUserName} show={this.state.deleteUserModal} onClose={(c) => this.closeDeleteUserModal(c)} />


    </div>;
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Scenario), { withProps: true });
