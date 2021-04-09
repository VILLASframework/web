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

import React, {Component} from "react";
import FileSaver from 'file-saver';
import IconButton from "../common/icon-button";
import Table from "../common/table";
import TableColumn from "../common/table-column";
import DeleteDialog from "../common/dialogs/delete-dialog";
import AppDispatcher from "../common/app-dispatcher";
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";
import ICAction from "../ic/ic-action";
import EditConfigDialog from "./edit-config";
import ImportConfigDialog from "./import-config";
import EditSignalMappingDialog from "../signal/edit-signal-mapping";

class ConfigTable extends Component {

  constructor() {
    super();

    this.state = {
      editConfigModal: false,
      modalConfigData: {},
      modalConfigIndex: 0,
      deleteConfigModal: false,
      importConfigModal: false,
      newConfig:  false,
      selectedConfigs: [],
      ExternalICInUse: false,
      editOutputSignalsModal:  false,
      editInputSignalsModal:  false,
    }
  }

  static getDerivedStateFromProps(props, state){

    let ExternalICInUse = false

    for (let config of props.configs){
      for (let component of props.ics) {
        if ((config.icID === component.id) && (component.managedexternally === true)) {
          ExternalICInUse = true;
          break;
        }
      }
    }

    return {
      ExternalICInUse: ExternalICInUse
    };
  }

  addConfig() {
    const config = {
      scenarioID: this.props.scenario.id,
      name: 'New Component Configuration',
      icID: this.props.ics.length > 0 ? this.props.ics[0].id : null,
      startParameters: {},
    };

    AppDispatcher.dispatch({
      type: 'configs/start-add',
      data: config,
      token: this.props.sessionToken
    });

    this.setState({ newConfig: true });

  }

  closeEditConfigModal(data) {
    this.setState({ editConfigModal: false, newConfig: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'configs/start-edit',
        data: data,
        token: this.props.sessionToken,
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
      token: this.props.sessionToken
    });
  }

  importConfig(data) {
    this.setState({ importConfigModal: false });

    if (data == null) {
      return;
    }

    let newConfig = JSON.parse(JSON.stringify(data.config))

    newConfig["scenarioID"] = this.props.scenario.id;
    newConfig.name = data.name;

    AppDispatcher.dispatch({
      type: 'configs/start-add',
      data: newConfig,
      token: this.props.sessionToken
    });
  }

  copyConfig(index) {
    let config = JSON.parse(JSON.stringify(this.props.configs[index]));

    let signals = JSON.parse(JSON.stringify(this.props.signals.filter(s => s.configID === parseInt(config.id, 10))));
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
    newConfig["scenarioID"] = this.props.scenario.id;
    newConfig.name = newConfig.name + '_copy';

    AppDispatcher.dispatch({
      type: 'configs/start-add',
      data: newConfig,
      token: this.props.sessionToken
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
    for (let component of this.props.ics) {
      if (component.id === this.props.configs[index].icID) {
        if (component.managedexternally === true) {
          return true
        }
      }
    }
    return false
  }

  getICName(icID) {
    for (let ic of this.props.ics) {
      if (ic.id === icID) {
        return ic.name || ic.uuid;
      }
    }
  }

  /* ##############################################
  * Signal modification methods
  ############################################## */

  closeEditSignalsModal(direction) {

    // reload the config
    AppDispatcher.dispatch({
      type: 'configs/start-load',
      data: this.state.modalConfigData.id,
      token: this.props.sessionToken
    });

    if (direction === "in") {
      this.setState({ editInputSignalsModal: false });
    } else if (direction === "out") {
      this.setState({ editOutputSignalsModal: false });
    }
  }

  signalsAutoConf(index) {
    let componentConfig = this.props.configs[index];
    // determine apiurl of infrastructure component
    let ic = this.props.ics.find(ic => ic.id === componentConfig.icID)
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
      token: this.props.sessionToken,
      configID: componentConfig.id
    });

  }

  startPintura(configIndex) {
    let config = this.props.configs[configIndex];

    // get xml / CIM file
    let files = []
    for (let id of config.fileIDs) {
      for (let file of this.props.files) {
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
        token: this.props.sessionToken,
        endpoint: baseURL + String(file.id),
      }

      // TODO start Pintura for editing CIM/ XML file from here
      console.warn("Starting Pintura... and nothing happens so far :-) ", params)
    }
  }

  render() {
    return (
      <div>
        {/*Component Configurations table*/}
        <h2 style={this.props.tableHeadingStyle}>Component Configurations
          <span className='icon-button'>
          <IconButton
            ikey={0}
            tooltip='Add Component Configuration'
            onClick={() => this.addConfig()}
            icon='plus'
            disabled={this.props.locked}
          />
          <IconButton
            ikey={1}
            tooltip='Import Component Configuration'
            onClick={() => this.setState({ importConfigModal: true })}
            icon='upload'
            disabled={this.props.locked}
          />
        </span>
        </h2>
        <Table data={this.props.configs}>
          <TableColumn
            checkbox
            checkboxDisabled={(index) => !this.usesExternalIC(index)}
            onChecked={(index, event) => this.onConfigChecked(index, event)}
            width={20}
          />
          {this.props.currentUser.role === "Admin" ?
            <TableColumn
              title='ID'
              dataKey='id'
              width={70}
            />
            : <></>
          }
          <TableColumn
            title='Name'
            dataKey='name'
            width={250}
          />
          <TableColumn
            title='# Output Signals'
            dataKey='outputLength'
            editButton
            onEdit={index => this.setState({ editOutputSignalsModal: true, modalConfigData: this.props.configs[index], modalConfigIndex: index })}
            width={150}
            locked={this.props.locked}
          />
          <TableColumn
            title='# Input Signals'
            dataKey='inputLength'
            editButton
            onEdit={index => this.setState({ editInputSignalsModal: true, modalConfigData: this.props.configs[index], modalConfigIndex: index })}
            width={150}
            locked={this.props.locked}
          />
          <TableColumn
            title='Import Signals'
            exportButton
            onExport={(index) => this.signalsAutoConf(index)}
            width={150}
          />
          <TableColumn
            title='Infrastructure Component'
            dataKey='icID'
            modifier={(icID) => this.getICName(icID)}
            width={200}
          />
          <TableColumn
            title=''
            width={200}
            align='right'
            editButton
            deleteButton
            exportButton
            duplicateButton
            onEdit={index => this.setState({ editConfigModal: true, modalConfigData: this.props.configs[index], modalConfigIndex: index })}
            onDelete={(index) => this.setState({ deleteConfigModal: true, modalConfigData: this.props.configs[index], modalConfigIndex: index })}
            onExport={index => this.exportConfig(index)}
            onDuplicate={index => this.duplicateConfig(index)}
            locked={this.props.locked}
          />
        </Table>

        {this.state.ExternalICInUse ?
          <div style={{ float: 'left' }}>
            <ICAction
              ics={this.props.ics}
              configs={this.props.configs}
              selectedConfigs = {this.state.selectedConfigs}
              snapshotConfig = {(index) => this.copyConfig(index)}
              token = {this.props.sessionToken}
              actions={[
                { id: '0', title: 'Start', data: { action: 'start' } },
                { id: '1', title: 'Stop', data: { action: 'stop' } },
                { id: '2', title: 'Pause', data: { action: 'pause' } },
                { id: '3', title: 'Resume', data: { action: 'resume' } }
              ]} />
          </div>
          : <div />
        }

        <div style={{ clear: 'both' }} />

        <EditConfigDialog
          show={this.state.editConfigModal}
          onClose={data => this.closeEditConfigModal(data)}
          config={this.state.modalConfigData}
          ics={this.props.ics}
          files={this.props.files}
          sessionToken={this.props.sessionToken}
        />
        <ImportConfigDialog
          show={this.state.importConfigModal}
          onClose={data => this.importConfig(data)}
          ics={this.props.ics}
        />
        <DeleteDialog
          title="component configuration"
          name={this.state.modalConfigData.name}
          show={this.state.deleteConfigModal}
          onClose={(c) => this.closeDeleteConfigModal(c)}
        />
        <EditSignalMappingDialog
          show={this.state.editOutputSignalsModal}
          onCloseEdit={(direction) => this.closeEditSignalsModal(direction)}
          direction="Output"
          signals={this.props.signals}
          configID={this.state.modalConfigData.id}
          sessionToken={this.props.sessionToken}
        />
        <EditSignalMappingDialog
          show={this.state.editInputSignalsModal}
          onCloseEdit={(direction) => this.closeEditSignalsModal(direction)}
          direction="Input"
          signals={this.props.signals}
          configID={this.state.modalConfigData.id}
          sessionToken={this.props.sessionToken}
        />
      </div>
    )
  }
}

export default ConfigTable;
