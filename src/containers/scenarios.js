/**
 * File: scenarios.js
 * Author: Sonja Happ <sonja.happ@eonerc.rwth-aachen.de>
 * Date: 20.08.2019
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

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { Button } from 'react-bootstrap';
import FileSaver from 'file-saver';

import AppDispatcher from '../app-dispatcher';
import ScenarioStore from '../stores/scenario-store';
import UserStore from '../stores/user-store';
import SimulatorStore from '../stores/simulator-store';
import SimulationModelStore from '../stores/simulation-model-store';

import Icon from '../components/icon';
import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewScenarioDialog from '../components/dialogs/new-scenario';
import EditScenarioDialog from '../components/dialogs/edit-scenario';
import ImportScenarioDialog from '../components/dialogs/import-scenario';

import SimulatorAction from '../components/simulator-action';
import DeleteDialog from '../components/dialogs/delete-dialog';

class Scenarios extends Component {
  static getStores() {
    return [ ScenarioStore, UserStore, SimulatorStore, SimulationModelStore ];
  }

  static calculateState() {
    const scenarios = ScenarioStore.getState();
    const simulationModels = SimulationModelStore.getState();
    const simulators = SimulatorStore.getState();

    const sessionToken = UserStore.getState().token;

    return {
      scenarios,
      simulationModels,
      simulators,
      sessionToken,

      newModal: false,
      deleteModal: false,
      editModal: false,
      importModal: false,
      modalScenario: {},

      selectedScenarios: []
    };
  }

  componentDidMount() {
    AppDispatcher.dispatch({
      type: 'scenarios/start-load',
      token: this.state.sessionToken
    });
  }

  componentDidUpdate() {
    const simulationModelIds = [];
    const simulatorIds = [];

    for (let scenario of this.state.scenarios) {
      for (let modelId of scenario.simulationModels) {
        const model = this.state.simulationModels.find(m => m != null && m.id === modelId);

        if (model == null) {
          simulationModelIds.push(modelId);

          continue;
        }

        if (this.state.simulators.includes(s => s._id === model.simulator) === false) {
          simulatorIds.push(model.simulator);
        }
      }
    }

    if (simulationModelIds.length > 0) {
      AppDispatcher.dispatch({
        type: 'simulationModels/start-load',
        data: simulationModelIds,
        token: this.state.sessionToken
      });
    }

    if (simulatorIds.length > 0) {
      AppDispatcher.dispatch({
        type: 'simulators/start-load',
        data: simulatorIds,
        token: this.state.sessionToken
      });
    }
  }

  closeNewModal(data) {
    this.setState({ newModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'scenarios/start-add',
        data,
        token: this.state.sessionToken
      });
    }
  }

  showDeleteModal(id) {
    // get scenario by id
    var deleteScenario;

    this.state.scenarios.forEach((scenario) => {
      if (scenario.id === id) {
        deleteScenario = scenario;
      }
    });

    this.setState({ deleteModal: true, modalScenario: deleteScenario });
  }

  closeDeleteModal = confirmDelete => {
    this.setState({ deleteModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'scenarios/start-remove',
      data: this.state.modalScenario,
      token: this.state.sessionToken
    });
  }

  showEditModal(id) {
    // get scenario by id
    var editScenario;

    this.state.scenarios.forEach((scenario) => {
      if (scenario.id === id) {
        editScenario = scenario;
      }
    });

    this.setState({ editModal: true, modalScenario: editScenario });
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

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
        data,
        token: this.state.sessionToken
      });
    }
  }

  onModalKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      this.confirmDeleteModal();
    }
  }

  exportScenario(index) {
    // filter properties
    let scenario = Object.assign({}, this.state.scenarios[index]);
    delete scenario.id;
    delete scenario.users;
    delete scenario.dashboards;

    scenario.simulationModels.forEach(model => {
      delete model.simulator;
    });

    // show save dialog
    const blob = new Blob([JSON.stringify(scenario, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'scenario - ' + scenario.name + '.json');
  }

  onScenarioChecked(index, event) {
    const selectedScenarios = Object.assign([], this.state.selectedScenarios);
    for (let key in selectedScenarios) {
      if (selectedScenarios[key] === index) {
        // update existing entry
        if (event.target.checked) {
          return;
        }

        selectedScenarios.splice(key, 1);

        this.setState({ selectedScenarios });
        return;
      }
    }

    // add new entry
    if (event.target.checked === false) {
      return;
    }

    selectedScenarios.push(index);
    this.setState({ selectedScenarios });
  }

  runAction = action => {
    for (let index of this.state.selectedScenarios) {
      for (let model of this.state.scenarios[index].simulationModels) {
        // get simulation model
        const simulationModel = this.state.simulationModels.find(m => m != null && m.id === model);
        if (simulationModel == null) {
          continue;
        }

        // get simulator for model
        let simulator = null;
        for (let sim of this.state.simulators) {
          if (sim.id === simulationModel.simulatorID) {
            simulator = sim;
          }
        }

        if (simulator == null) {
          continue;
        }

        if (action.data.action === 'start') {
          action.data.parameters = Object.assign({}, this.state.scenarios[index].startParameters, simulationModel.startParameters);
        }

        AppDispatcher.dispatch({
          type: 'simulators/start-action',
          simulator,
          data: action.data,
          token: this.state.sessionToken
        });
      }
    }
  }

  render() {
    const buttonStyle = {
      marginLeft: '10px'
    };

    return (
      <div className='section'>
        <h1>Scenarios</h1>

        <Table data={this.state.scenarios}>
          <TableColumn checkbox onChecked={(index, event) => this.onScenarioChecked(index, event)} width='30' />
          <TableColumn title='Name' dataKey='name' link='/scenarios/' linkKey='id' />
          <TableColumn
            width='100'
            editButton
            deleteButton
            exportButton
            onEdit={index => this.setState({ editModal: true, modalScenario: this.state.scenarios[index] })}
            onDelete={index => this.setState({ deleteModal: true, modalScenario: this.state.scenarios[index] })}
            onExport={index => this.exportScenario(index)}
          />
        </Table>

        <div style={{ float: 'left' }}>
          <SimulatorAction
            runDisabled={this.state.selectedScenarios.length === 0}
            runAction={this.runAction}
            actions={[
              { id: '0', title: 'Start', data: { action: 'start' } },
              { id: '1', title: 'Stop', data: { action: 'stop' } },
              { id: '2', title: 'Pause', data: { action: 'pause' } },
              { id: '3', title: 'Resume', data: { action: 'resume' } }
            ]}/>
        </div>

        <div style={{ float: 'right' }}>
          <Button onClick={() => this.setState({ newModal: true })} style={buttonStyle}><Icon icon="plus" /> Scenario</Button>
          <Button onClick={() => this.setState({ importModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>
        </div>

        <div style={{ clear: 'both' }} />

        <NewScenarioDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />
        <EditScenarioDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} scenario={this.state.modalScenario} />
        <ImportScenarioDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} nodes={this.state.nodes} />

        <DeleteDialog title="scenario" name={this.state.modalScenario.name} show={this.state.deleteModal} onClose={this.closeDeleteModal} />
      </div>
    );
  }
}

let fluxContainerConverter = require('./FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Scenarios));
