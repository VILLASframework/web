/**
 * File: simulations.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
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
import SimulationStore from '../stores/simulation-store';
import UserStore from '../stores/user-store';
import SimulatorStore from '../stores/simulator-store';
import SimulationModelStore from '../stores/simulation-model-store';

import Icon from '../components/icon';
import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewSimulationDialog from '../components/dialogs/new-simulation';
import EditSimulationDialog from '../components/dialogs/edit-simulation';
import ImportSimulationDialog from '../components/dialogs/import-simulation';

import SimulatorAction from '../components/simulator-action';
import DeleteDialog from '../components/dialogs/delete-dialog';

class Simulations extends Component {
  static getStores() {
    return [ SimulationStore, UserStore, SimulatorStore, SimulationModelStore ];
  }

  static calculateState() {
    const simulations = SimulationStore.getState();
    const simulationModels = SimulationModelStore.getState();
    const simulators = SimulatorStore.getState();

    const sessionToken = UserStore.getState().token;

    return {
      simulations,
      simulationModels,
      simulators,
      sessionToken,

      newModal: false,
      deleteModal: false,
      editModal: false,
      importModal: false,
      modalSimulation: {},

      selectedSimulations: []
    };
  }

  componentDidMount() {
    AppDispatcher.dispatch({
      type: 'simulations/start-load',
      token: this.state.sessionToken
    });
  }

  componentDidUpdate() {
    const simulationModelIds = [];
    const simulatorIds = [];

    for (let simulation of this.state.simulations) {
      for (let modelId of simulation.models) {
        const model = this.state.simulationModels.find(m => m != null && m._id === modelId);

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
        type: 'simulations/start-add',
        data,
        token: this.state.sessionToken
      });
    }
  }

  showDeleteModal(id) {
    // get simulation by id
    var deleteSimulation;

    this.state.simulations.forEach((simulation) => {
      if (simulation._id === id) {
        deleteSimulation = simulation;
      }
    });

    this.setState({ deleteModal: true, modalSimulation: deleteSimulation });
  }

  closeDeleteModal = confirmDelete => {
    this.setState({ deleteModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'simulations/start-remove',
      data: this.state.modalSimulation,
      token: this.state.sessionToken
    });
  }

  showEditModal(id) {
    // get simulation by id
    var editSimulation;

    this.state.simulations.forEach((simulation) => {
      if (simulation._id === id) {
        editSimulation = simulation;
      }
    });

    this.setState({ editModal: true, modalSimulation: editSimulation });
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data != null) {
      AppDispatcher.dispatch({
        type: 'simulations/start-edit',
        data,
        token: this.state.sessionToken
      });
    }
  }

  closeImportModal(data) {
    this.setState({ importModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'simulations/start-add',
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

  exportSimulation(index) {
    // filter properties
    let simulation = Object.assign({}, this.state.simulations[index]);
    delete simulation._id;
    delete simulation.projects;
    delete simulation.running;
    delete simulation.user;

    simulation.models.forEach(model => {
      delete model.simulator;
    });

    // show save dialog
    const blob = new Blob([JSON.stringify(simulation, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'simulation - ' + simulation.name + '.json');
  }

  onSimulationChecked(index, event) {
    const selectedSimulations = Object.assign([], this.state.selectedSimulations);
    for (let key in selectedSimulations) {
      if (selectedSimulations[key] === index) {
        // update existing entry
        if (event.target.checked) {
          return;
        }

        selectedSimulations.splice(key, 1);

        this.setState({ selectedSimulations });
        return;
      }
    }

    // add new entry
    if (event.target.checked === false) {
      return;
    }

    selectedSimulations.push(index);
    this.setState({ selectedSimulations });
  }

  runAction = action => {
    for (let index of this.state.selectedSimulations) {
      for (let model of this.state.simulations[index].models) {
        // get simulation model
        const simulationModel = this.state.simulationModels.find(m => m != null && m._id === model);
        if (simulationModel == null) {
          continue;
        }

        // get simulator for model
        let simulator = null;
        for (let sim of this.state.simulators) {
          if (sim._id === simulationModel.simulator) {
            simulator = sim;
          }
        }

        if (simulator == null) {
          continue;
        }

        if (action.data.action === 'start') {
          action.data.parameters = Object.assign({}, this.state.simulations[index].startParameters, simulationModel.startParameters);
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
        <h1>Simulations</h1>

        <Table data={this.state.simulations}>
          <TableColumn checkbox onChecked={(index, event) => this.onSimulationChecked(index, event)} width='30' />
          <TableColumn title='Name' dataKey='name' link='/simulations/' linkKey='_id' />
          <TableColumn
            width='100'
            editButton
            deleteButton
            exportButton
            onEdit={index => this.setState({ editModal: true, modalSimulation: this.state.simulations[index] })}
            onDelete={index => this.setState({ deleteModal: true, modalSimulation: this.state.simulations[index] })}
            onExport={index => this.exportSimulation(index)}
          />
        </Table>

        <div style={{ float: 'left' }}>
          <SimulatorAction
            runDisabled={this.state.selectedSimulations.length === 0}
            runAction={this.runAction}
            actions={[
              { id: '0', title: 'Start', data: { action: 'start' } },
              { id: '1', title: 'Stop', data: { action: 'stop' } },
              { id: '2', title: 'Pause', data: { action: 'pause' } },
              { id: '3', title: 'Resume', data: { action: 'resume' } }
            ]}/>
        </div>

        <div style={{ float: 'right' }}>
          <Button onClick={() => this.setState({ newModal: true })} style={buttonStyle}><Icon icon="plus" /> Simulation</Button>
          <Button onClick={() => this.setState({ importModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>
        </div>

        <div style={{ clear: 'both' }} />

        <NewSimulationDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />
        <EditSimulationDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} simulation={this.state.modalSimulation} />
        <ImportSimulationDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} nodes={this.state.nodes} />

        <DeleteDialog title="simulation" name={this.state.modalSimulation.name} show={this.state.deleteModal} onClose={this.closeDeleteModal} />
      </div>
    );
  }
}

let fluxContainerConverter = require('./FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Simulations));
