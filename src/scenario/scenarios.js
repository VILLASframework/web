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
import FileSaver from 'file-saver';

import AppDispatcher from '../common/app-dispatcher';
import ScenarioStore from './scenario-store';
import DashboardStore from '../dashboard/dashboard-store';
import WidgetStore from "../widget/widget-store";
import ConfigStore from '../componentconfig/config-store';
import SignalStore from '../signal/signal-store'

import Icon from '../common/icon';
import Table from '../common/table';
import TableColumn from '../common/table-column';
import NewScenarioDialog from './new-scenario';
import EditScenarioDialog from './edit-scenario';
import ImportScenarioDialog from './import-scenario';

import DeleteDialog from '../common/dialogs/delete-dialog';
import IconButton from '../common/icon-button';


class Scenarios extends Component {

  static getStores() {
    return [ScenarioStore, DashboardStore, WidgetStore, ConfigStore, SignalStore];
  }

  static calculateState(prevState, props) {
    if (prevState == null) {
      prevState = {};
    }

    return {
      scenarios: ScenarioStore.getState(),
      dashboards: DashboardStore.getState(),
      configs: ConfigStore.getState(),
      sessionToken: localStorage.getItem("token"),

      newModal: false,
      duplicateModal: false,
      deleteModal: false,
      editModal: false,
      importModal: false,
      modalScenario: {},
      selectedScenarios: prevState.selectedScenarios || [],
      currentUser: JSON.parse(localStorage.getItem("currentUser"))
    };
  }

  componentDidMount() {
    AppDispatcher.dispatch({
      type: 'scenarios/start-load',
      token: this.state.sessionToken
    });
  }

  closeNewModal(data) {
    if (data) {
      AppDispatcher.dispatch({
        type: 'scenarios/start-add',
        data: data,
        token: this.state.sessionToken,
      });
    }
    this.setState({ newModal: false });
  }

  showDeleteModal(id) {
    // get scenario by id
    let deleteScenario;

    this.state.scenarios.forEach((scenario) => {
      if (scenario.id === id) {
        deleteScenario = scenario;
      }
    });

    this.setState({ deleteModal: true, modalScenario: deleteScenario });
  }

  closeDeleteModal(confirmDelete) {
    this.setState({ deleteModal: false });

    if (confirmDelete === false) {
      return;
    }

    this.state.dashboards.forEach((dashboard) => {
      if (dashboard.id === this.state.modalScenario.id) {
        AppDispatcher.dispatch({
          type: 'dashboards/start-remove',
          data: dashboard,
          token: this.state.sessionToken
        })
      }
    });

    AppDispatcher.dispatch({
      type: 'scenarios/start-remove',
      data: this.state.modalScenario,
      token: this.state.sessionToken
    });
  };

  closeEditModal(data) {
    this.setState({ editModal: false });

    if (data != null) {
      AppDispatcher.dispatch({
        type: 'scenarios/start-edit',
        data,
        token: this.state.sessionToken
      });
    }
  }

  closeImportModal(data) {
    this.setState({ importModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'scenarios/start-add',
        data: data,
        token: this.state.sessionToken,
      });
    }
  }

  onModalKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      this.confirmDeleteModal();
    }
  };

  getConfigs(scenarioID) {
    let configs = JSON.parse(JSON.stringify(this.state.configs.filter(config => config.scenarioID === scenarioID)));
    configs.forEach((config) => {
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
    })

    return configs;
  }

  getDashboards(scenarioID) {
    let dashboards = JSON.parse(JSON.stringify(this.state.dashboards.filter(dashb => dashb.scenarioID === scenarioID)));
    // add Dashboards and Widgets to JSON object
    dashboards.forEach((dboard) => {
      let widgets = JSON.parse(JSON.stringify(WidgetStore.getState().filter(w => w.dashboardID === parseInt(dboard.id, 10))));
      widgets.forEach((widget) => {
        delete widget.dashboardID;
        delete widget.id;
      })
      dboard["widgets"] = widgets;
      delete dboard.scenarioID;
      delete dboard.id;
    });
    return dashboards;
  }

  exportScenario(index) {
    // copy by value by converting to JSON and back
    // otherwise, IDs of state objects will be deleted
    let scenario = JSON.parse(JSON.stringify(this.state.scenarios[index]));
    let scenarioID = scenario.id;
    delete scenario.id;

    let jsonObj = scenario;
    jsonObj["configs"] = this.getConfigs(scenarioID);
    jsonObj["dashboards"] = this.getDashboards(scenarioID);

    // create JSON string and show save dialog
    const blob = new Blob([JSON.stringify(jsonObj, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'scenario - ' + scenario.name + '.json');
  }

  duplicateScenario(index) {
    let scenario = JSON.parse(JSON.stringify(this.state.scenarios[index]));
    scenario.name = scenario.name + '_copy';
    let jsonObj = scenario;

    jsonObj["configs"] = this.getConfigs(scenario.id);
    jsonObj["dashboards"] = this.getDashboards(scenario.id);

    if (jsonObj) {
      AppDispatcher.dispatch({
        type: 'scenarios/start-add',
        data: jsonObj,
        token: this.state.sessionToken,
      });
    }
  }

  isLocked(index) {
    return this.state.scenarios[index].isLocked;
  }

  onLock(index) {
    let data = {};
    data.id = this.state.scenarios[index].id;
    data.isLocked = !this.state.scenarios[index].isLocked;

    AppDispatcher.dispatch({
      type: 'scenarios/start-edit',
      data,
      token: this.state.sessionToken
    });
  }

  render() {
    const buttonStyle = {
      marginLeft: '10px',
    }

    const iconStyle = {
      height: '30px',
      width: '30px'
    }

    return <div className='section'>
      <h1>Scenarios
          <span className='icon-button'>
          <IconButton
            ikey={0}
            tooltip='Add Scenario'
            onClick={() => this.setState({ newModal: true })}
            icon='plus'
            buttonStyle={buttonStyle}
            iconStyle={iconStyle}
          />
          <IconButton
            ikey={1}
            tooltip='Import Scenario'
            onClick={() => this.setState({ importModal: true })}
            icon='upload'
            buttonStyle={buttonStyle}
            iconStyle={iconStyle}
          />
        </span>
      </h1>

      <Table data={this.state.scenarios}>
        {this.state.currentUser.role === "Admin" ?
          <TableColumn
            title='ID'
            dataKey='id'
          />
          : <></>
        }
        <TableColumn
          title='Name'
          dataKey='name'
          link='/scenarios/'
          linkKey='id'
        />
        {this.state.currentUser.role === "Admin" ?
          <TableColumn
            title='Locked'
            lockButton
            checkboxKey='isLocked'
            onChangeLock={(index, event) => this.onLock(index)}
            isLocked={index => this.isLocked(index)}
          />
          : <></>
        }
        <TableColumn
          width='200'
          align='right'
          editButton
          deleteButton
          exportButton
          duplicateButton
          onEdit={index => this.setState({ editModal: true, modalScenario: this.state.scenarios[index] })}
          onDelete={index => this.setState({ deleteModal: true, modalScenario: this.state.scenarios[index] })}
          onExport={index => this.exportScenario(index)}
          onDuplicate={index => this.duplicateScenario(index)}
          isLocked={index => this.isLocked(index)}
        />
      </Table>

      <NewScenarioDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />
      <EditScenarioDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} scenario={this.state.modalScenario} />
      <ImportScenarioDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} nodes={this.state.nodes} />

      <DeleteDialog title="scenario" name={this.state.modalScenario.name} show={this.state.deleteModal} onClose={(e) => this.closeDeleteModal(e)} />
    </div>;
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Scenarios));
