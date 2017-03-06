/**
 * File: simulation.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { Button, Modal, Glyphicon } from 'react-bootstrap';

import SimulationStore from '../stores/simulation-store';
import SimulatorStore from '../stores/simulator-store';
import AppDispatcher from '../app-dispatcher';

import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewSimulationModelDialog from '../components/dialog/new-simulation-model';
import EditSimulationModelDialog from '../components/dialog/edit-simulation-model';

class Simulation extends Component {
  static getStores() {
    return [ SimulationStore, SimulatorStore ];
  }

  static calculateState() {
    return {
      simulations: SimulationStore.getState(),
      simulators: SimulatorStore.getState(),

      newModal: false,
      deleteModal: false,
      editModal: false,
      modalData: {},

      simulation: {}
    }
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'simulations/start-load'
    });

    AppDispatcher.dispatch({
      type: 'simulators/start-load'
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
    this.setState({ deleteModal: false });



    /*AppDispatcher.dispatch({
      type: 'visualizations/start-remove',
      data: this.state.modalVisualization
    });*/
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data) {
      /*AppDispatcher.dispatch({
        type: 'visualizations/start-edit',
        data: data
      });*/
    }
  }

  getSimulatorName(id) {
    for (var i = 0; i < this.state.simulators.length; i++) {
      if (this.state.simulators[i]._id === id) {
        return this.state.simulators[i].name;
      }
    }

    return id;
  }

  render() {
    return (
      <div>
        <h1>{this.state.simulation.name}</h1>

        <Table data={this.state.simulation.models}>
          <TableColumn title='Name' dataKey='name' />
          <TableColumn title='Simulator' dataKey='simulator' width='180' modifier={(id) => this.getSimulatorName(id)} />
          <TableColumn title='Length' dataKey='length' width='100' />
          <TableColumn title='' width='70' editButton deleteButton onEdit={(index) => this.setState({ editModal: true, modalData: this.state.simulation.models[index] })} onDelete={(index) => this.setState({ deleteModal: true, modalData: this.state.simulation.models[index] })} />
        </Table>

        <Button onClick={() => this.setState({ newModal: true })}><Glyphicon glyph="plus" /> Simulation Model</Button>

        <NewSimulationModelDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} simulators={this.state.simulators} />

        <EditSimulationModelDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} data={this.state.modalData} />

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
