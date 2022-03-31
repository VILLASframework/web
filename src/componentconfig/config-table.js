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

import React, { Component } from "react";
import FileSaver from 'file-saver';
import IconButton from "../common/buttons/icon-button";
import { Table, ButtonColumn, CheckboxColumn, DataColumn } from "../common/table";
import NewDialog from "../common/dialogs/new-dialog";
import DeleteDialog from "../common/dialogs/delete-dialog";
import AppDispatcher from "../common/app-dispatcher";
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";
import ICActionBoard from "../ic/ic-action-board";
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
      newConfigModal: false,
      deleteConfigModal: false,
      importConfigModal: false,
      allConfigsChecked: false,
      selectedConfigs: [],
      ExternalICInUse: false,
      editOutputSignalsModal: false,
      editInputSignalsModal: false,
    }
  }

  static getDerivedStateFromProps(props, state) {

    let ExternalICInUse = false

    for (let config of props.configs) {
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

  closeNewConfigModal(data) {
    this.setState({ newConfigModal: false });

    if (data) {
      const config = {
        scenarioID: this.props.scenario.id,
        name: data.value,
        icID: this.props.ics.length > 0 ? this.props.ics[0].id : null,
        startParameters: {},
      };

      AppDispatcher.dispatch({
        type: 'configs/start-add',
        data: config,
        token: this.props.sessionToken
      });
    }
  }

  closeEditConfigModal(data) {
    this.setState({ editConfigModal: false });

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

  onConfigChecked(config, event) {
    const selectedConfigs = Object.assign([], this.state.selectedConfigs);

    /* update existing entry */
    for (let key in selectedConfigs) {
      if (selectedConfigs[key] === config) {
        if (event.target.checked) {
          return;
        }

        selectedConfigs.splice(key, 1);
        this.setState({ selectedConfigs: selectedConfigs });
        return;
      }
    }

    /* add new entry */
    if (event.target.checked === false) {
      return;
    }
    selectedConfigs.push(config);
    this.setState({ selectedConfigs: selectedConfigs });
  }

  checkAllConfigs() {
    if (this.state.allConfigsChecked) {
      this.setState({ selectedConfigs: [], allConfigsChecked: !this.state.allConfigsChecked })
      return
    }

    let index = 0
    let checkedConfigs = []
    this.props.configs.forEach(cfg => {
      if (this.usesExternalIC(index)) {
        checkedConfigs.push(cfg)
      }
      index++
    })

    this.setState({ selectedConfigs: checkedConfigs, allConfigsChecked: !this.state.allConfigsChecked })
  }

  isConfigChecked(cfg) {
    if (!cfg) return false

    return this.state.selectedConfigs.includes(cfg)
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

  computeNumberOfSignals(configID, direction) {
    let signals = this.props.signals.filter(s => (s.configID === configID && s.direction === direction))
    return <span>{signals.length}</span>
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
    const buttonStyle = {
      marginLeft: '10px',
    }

    const iconStyle = {
      height: '30px',
      width: '30px'
    }

    return (
      <div>
        {/*Component Configurations table*/}
        <h2 style={this.props.tableHeadingStyle}>Component Configurations
          <span className='icon-button'>
            <IconButton
              childKey={0}
              tooltip='Add Component Configuration'
              onClick={() => this.setState({ newConfigModal: true })}
              icon='plus'
              disabled={this.props.locked}
              hidetooltip={this.props.locked}
              buttonStyle={buttonStyle}
              iconStyle={iconStyle}
            />
            <IconButton
              childKey={1}
              tooltip='Import Component Configuration'
              onClick={() => this.setState({ importConfigModal: true })}
              icon='upload'
              disabled={this.props.locked}
              hidetooltip={this.props.locked}
              buttonStyle={buttonStyle}
              iconStyle={iconStyle}
            />
          </span>
        </h2>
        <Table
          data={this.props.configs}
          allRowsChecked={this.state.allConfigsChecked}
        >
          <CheckboxColumn
            enableCheckAll
            onCheckAll={() => this.checkAllConfigs()}
            allChecked={this.state.allConfigsChecked}
            checked={(cfg) => this.isConfigChecked(cfg)}
            checkboxDisabled={(index) => !this.usesExternalIC(index)}
            onChecked={(index, event) => this.onConfigChecked(index, event)}
            width={20}
          />
          {this.props.currentUser.role === "Admin" ?
            <DataColumn
              title='ID'
              dataKey='id'
              width={70}
            />
            : <></>
          }
          <DataColumn
            title='Name'
            dataKey='name'
            width={250}
          />
          <ButtonColumn
            title='# Output Signals'
            dataKey='id'
            editButton
            onEdit={index => this.setState({ editOutputSignalsModal: true, modalConfigData: this.props.configs[index], modalConfigIndex: index })}
            width={150}
            locked={this.props.locked}
            modifier={(component) => this.computeNumberOfSignals(component, "out")}
          />
          <ButtonColumn
            title='# Input Signals'
            dataKey='id'
            editButton
            onEdit={index => this.setState({ editInputSignalsModal: true, modalConfigData: this.props.configs[index], modalConfigIndex: index })}
            width={150}
            locked={this.props.locked}
            modifier={(component) => this.computeNumberOfSignals(component, "in")}
          />
          <ButtonColumn
            title='Autoconfigure Signals'
            signalButton
            onAutoConf={(index) => this.signalsAutoConf(index)}
            width={170}
            locked={this.props.locked}
          />
          <DataColumn
            title='Infrastructure Component'
            dataKey='icID'
            modifier={(icID) => this.getICName(icID)}
            width={200}
          />
          <ButtonColumn
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
          <div>
            <ICActionBoard
              ics={this.props.ics}
              configs={this.props.configs}
              selectedConfigs={this.state.selectedConfigs}
              snapshotConfig={(index) => this.copyConfig(index)}
              token={this.props.sessionToken}
              doStart={true}
              enableResultCheck={true}
              doPauseResume={true}
              doStop={true}
              doReset={false}
              doShutdown={false}
              doDelete={false}
              doRecreate={false}
            />
          </div>
          : <div/>
        }

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
        <NewDialog
          show={this.state.newConfigModal}
          title="New Component Configuration"
          inputLabel="Name"
          placeholder="Enter name"
          onClose={data => this.closeNewConfigModal(data)}
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
