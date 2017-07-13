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

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { Button, Modal, Glyphicon } from 'react-bootstrap';

import SimulationStore from '../stores/simulation-store';
import NodeStore from '../stores/node-store';
import AppDispatcher from '../app-dispatcher';

import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewSimulationModelDialog from '../components/dialog/new-simulation-model';
import EditSimulationModelDialog from '../components/dialog/edit-simulation-model';

class Simulation extends Component {
  static getStores() {
    return [ SimulationStore, NodeStore ];
  }

  static calculateState() {
    return {
      simulations: SimulationStore.getState(),
      nodes: NodeStore.getState(),

      newModal: false,
      deleteModal: false,
      editModal: false,
      modalData: {},
      modalIndex: null,

      simulation: {}
    }
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'simulations/start-load'
    });

    AppDispatcher.dispatch({
      type: 'nodes/start-load'
    });
  }

  componentDidUpdate() {
    if (this.state.simulation._id !== this.props.params.simulation) {
      this.reloadSimulation();
    }
  }

  reloadSimulation() {
    // select simulation by param id
    this.state.simulations.forEach((simulation) => {
      if (simulation._id === this.props.params.simulation) {
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
        data: this.state.simulation
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
      data: simulation
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
        data: simulation
      });
    }
  }

  getSimulatorName(simulator) {
    var name = "undefined";

    this.state.nodes.forEach(node => {
      if (node._id === simulator.node) {
        name = node.name + '/' + node.simulators[simulator.simulator].name;
      }
    });

    return name;
  }

  render() {
    return (
      <div className='section'>
        <h1>{this.state.simulation.name}</h1>

        <Table data={this.state.simulation.models}>
          <TableColumn title='Name' dataKey='name' />
          <TableColumn title='Simulator' dataKey='simulator' width='180' modifier={(simulator) => this.getSimulatorName(simulator)} />
          <TableColumn title='Length' dataKey='length' width='100' />
          <TableColumn title='' width='70' editButton deleteButton onEdit={(index) => this.setState({ editModal: true, modalData: this.state.simulation.models[index], modalIndex: index })} onDelete={(index) => this.setState({ deleteModal: true, modalData: this.state.simulation.models[index], modalIndex: index })} />
        </Table>

        <Button onClick={() => this.setState({ newModal: true })}><Glyphicon glyph="plus" /> Simulation Model</Button>

        <NewSimulationModelDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} nodes={this.state.nodes} />

        <EditSimulationModelDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} data={this.state.modalData} nodes={this.state.nodes} />

        <Modal show={this.state.deleteModal}>
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
