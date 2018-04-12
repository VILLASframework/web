/**
 * File: simulation.js
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

import React from 'react';
import { Container } from 'flux/utils';
import { Button, Modal, Glyphicon, DropdownButton, MenuItem } from 'react-bootstrap';
import FileSaver from 'file-saver';

import SimulationStore from '../stores/simulation-store';
import SimulatorStore from '../stores/simulator-store';
import UserStore from '../stores/user-store';
import AppDispatcher from '../app-dispatcher';

import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewSimulationModelDialog from '../components/dialog/new-simulation-model';
import EditSimulationModelDialog from '../components/dialog/edit-simulation-model';
import ImportSimulationModelDialog from '../components/dialog/import-simulation-model';

class Simulation extends React.Component {
  static getStores() {
    return [ SimulationStore, SimulatorStore, UserStore ];
  }

  static calculateState() {
    return {
      simulations: SimulationStore.getState(),
      simulators: SimulatorStore.getState(),
      sessionToken: UserStore.getState().token,

      newModal: false,
      deleteModal: false,
      editModal: false,
      importModal: false,
      modalData: {},
      modalIndex: null,

      simulation: {},

      runAction: 0,
      runTitle: 'Start',
      selectedSimulationModels: []
    }
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'simulations/start-load',
      token: this.state.sessionToken
    });

    AppDispatcher.dispatch({
      type: 'simulators/start-load',
      token: this.state.sessionToken
    });
  }

  componentDidUpdate() {
    if (this.state.simulation._id !== this.props.match.params.simulation) {
      this.reloadSimulation();
    }
  }

  reloadSimulation() {
    // select simulation by param id
    this.state.simulations.forEach((simulation) => {
      if (simulation._id === this.props.match.params.simulation) {
        // JSON.parse(JSON.stringify(obj)) = deep clone to make also copy of widget objects inside
        this.setState({ simulation: JSON.parse(JSON.stringify(simulation)) });
      }
    });
  }

  closeNewModal(data) {
    this.setState({ newModal : false });

    if (data) {
      this.state.simulation.models.push(data);

      AppDispatcher.dispatch({
        type: 'simulations/start-edit',
        data: this.state.simulation,
        token: this.state.sessionToken
      });
    }
  }

  confirmDeleteModal() {
    // remove model from simulation
    var simulation = this.state.simulation;
    simulation.models.splice(this.state.modalIndex, 1);

    this.setState({ deleteModal: false, simulation: simulation });

    AppDispatcher.dispatch({
      type: 'simulations/start-edit',
      data: simulation,
      token: this.state.sessionToken
    });
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data) {
      var simulation = this.state.simulation;
      simulation.models[this.state.modalIndex] = data;
      this.setState({ simulation: simulation });

      AppDispatcher.dispatch({
        type: 'simulations/start-edit',
        data: simulation,
        token: this.state.sessionToken
      });
    }
  }

  closeImportModal(data) {
    this.setState({ importModal: false });

    if (data) {
      this.state.simulation.models.push(data);
      
      AppDispatcher.dispatch({
        type: 'simulations/start-edit',
        data: this.state.simulation,
        token: this.state.sessionToken
      });
    }
  }

  getSimulatorName(simulatorId) {
    for (let simulator of this.state.simulators) {
      if (simulator._id === simulatorId) {
        if ('name' in simulator.rawProperties) {
          return simulator.rawProperties.name;
        } else {
          return simulator.uuid;
        }
      }
    }
  }

  exportModel(index) {
    // filter properties
    let simulationModel = Object.assign({}, this.state.simulation.models[index]);
    delete simulationModel.simulator;

    // show save dialog
    const blob = new Blob([JSON.stringify(simulationModel, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'simulation model - ' + simulationModel.name + '.json');
  }

  onModalKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    
      this.confirmDeleteModal();
    }
  }

  onSimulationModelChecked(index, event) {
    const selectedSimulationModels = this.state.selectedSimulationModels;
    for (let key in selectedSimulationModels) {
      if (selectedSimulationModels[key] === index) {
        // update existing entry
        if (event.target.checked) {
          return;
        }

        selectedSimulationModels.splice(key, 1);

        this.setState({ selectedSimulationModels });
        return;
      }
    }

    // add new entry
    if (event.target.checked === false) {
      return;
    }

    selectedSimulationModels.push(index);
    this.setState({ selectedSimulationModels });
  }

  setRunAction(index) {
    let runTitle = '';
    switch (index) {
      case '0':
        runTitle = 'Start';
        break;

      case '1':
        runTitle = 'Stop';
        break;

      case '2':
        runTitle = 'Pause';
        break;

      case '3':
        runTitle = 'Resume';
        break;

      default:
        console.log('Unknown index ' + index);
        break;
    }

    this.setState({ runAction: index, runTitle });
  }

  runAction() {
    for (let index of this.state.selectedSimulationModels) {
      let data;
      switch (this.state.runAction) {
        case '0':
          data = { action: 'start' };
          break;

        case '1':
          data = { action: 'stop' };
          break;

        case '2':
          data = { action: 'pause' };
          break;

        case '3':
          data = { action: 'resume' };
          break;

        default:
          console.warn('Unknown simulator action: ' + this.state.runAction);
          return;
      }

      // get simulator for model
      let simulator = null;
      for (let sim of this.state.simulators) {
        if (sim._id === this.state.simulation.models[index].simulator) {
          simulator = sim;
        }
      }

      if (simulator == null) {
        continue;
      }
  
      AppDispatcher.dispatch({
        type: 'simulators/start-action',
        simulator,
        data,
        token: this.state.sessionToken
      });
    }
  }

  render() {
    return (
      <div className='section'>
        <h1>{this.state.simulation.name}</h1>

        <Table data={this.state.simulation.models}>
        <TableColumn checkbox onChecked={(index, event) => this.onSimulationModelChecked(index, event)} width='30' />
          <TableColumn title='Name' dataKey='name' />
          <TableColumn title='Simulator' dataKey='simulator' width='180' modifier={(simulator) => this.getSimulatorName(simulator)} />
          <TableColumn title='Length' dataKey='length' width='100' />
          <TableColumn 
            title='' 
            width='100' 
            editButton 
            deleteButton 
            exportButton
            onEdit={(index) => this.setState({ editModal: true, modalData: this.state.simulation.models[index], modalIndex: index })} 
            onDelete={(index) => this.setState({ deleteModal: true, modalData: this.state.simulation.models[index], modalIndex: index })} 
            onExport={index => this.exportModel(index)}
          />
        </Table>

        <div style={{ float: 'left' }}>
        <DropdownButton title={this.state.runTitle} id="simulation-model-action-dropdown" onSelect={index => this.setRunAction(index)}>
            <MenuItem eventKey="0" active={this.state.runAction === '0'}>Start</MenuItem>
            <MenuItem eventKey="1" active={this.state.runAction === '1'}>Stop</MenuItem>
            <MenuItem eventKey="2" active={this.state.runAction === '2'}>Pause</MenuItem>
            <MenuItem eventKey="3" active={this.state.runAction === '3'}>Resume</MenuItem>
          </DropdownButton>

          <Button disabled={this.state.selectedSimulationModels.length <= 0} onClick={() => this.runAction()}>Run</Button>
        </div>

        <div style={{ float: 'right' }}>
          <Button onClick={() => this.setState({ newModal: true })}><Glyphicon glyph="plus" /> Simulation Model</Button>
          <Button onClick={() => this.setState({ importModal: true })}><Glyphicon glyph="import" /> Import</Button>
        </div>

        <NewSimulationModelDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} simulators={this.state.simulators} />
        <EditSimulationModelDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} data={this.state.modalData} simulators={this.state.simulators} />
        <ImportSimulationModelDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} simulators={this.state.simulators} />

        <Modal keyboard show={this.state.deleteModal} onHide={() => this.setState({ deleteModal: false })} onKeyPress={this.onModalKeyPress}>
          <Modal.Header>
            <Modal.Title>Delete Simulation Model</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the simulation model <strong>'{this.state.modalData.name}'</strong>?
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={() => this.setState({ deleteModal: false })}>Cancel</Button>
            <Button bsStyle="danger" onClick={() => this.confirmDeleteModal()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Container.create(Simulation);
