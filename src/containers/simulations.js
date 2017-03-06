/**
 * File: simulations.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { Button, Modal, Glyphicon } from 'react-bootstrap';

import AppDispatcher from '../app-dispatcher';
import SimulationStore from '../stores/simulation-store';

import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewSimulationDialog from '../components/dialog/new-simulation';
import EditSimulationDialog from '../components/dialog/edit-simulation';

class Simulations extends Component {
  static getStores() {
    return [ SimulationStore ];
  }

  static calculateState() {
    return {
      simulations: SimulationStore.getState(),

      newModal: false,
      deleteModal: false,
      editModal: false,
      modalSimulation: {}
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'simulations/start-load'
    });
  }

  closeNewModal(data) {
    this.setState({ newModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'simulations/start-add',
        data: data
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

  confirmDeleteModal() {
    this.setState({ deleteModal: false });

    AppDispatcher.dispatch({
      type: 'simulations/start-remove',
      data: this.state.modalSimulation
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

    if (data) {
      AppDispatcher.dispatch({
        type: 'simulations/start-edit',
        data: data
      });
    }
  }

  render() {
    return (
      <div>
        <h1>Simulations</h1>

        <Table data={this.state.simulations}>
          <TableColumn title='Name' dataKey='name' link='/simulations/' linkKey='_id' />
          <TableColumn width='70' editButton deleteButton onEdit={index => this.setState({ editModal: true, modalSimulation: this.state.simulations[index] })} onDelete={index => this.setState({ deleteModal: true, modalSimulation: this.state.simulations[index] })} />
        </Table>

        <Button onClick={() => this.setState({ newModal: true })}><Glyphicon glyph="plus" /> Simulation</Button>

        <NewSimulationDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />

        <EditSimulationDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} simulation={this.state.modalSimulation} />

        <Modal show={this.state.deleteModal}>
          <Modal.Header>
            <Modal.Title>Delete Simulation</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the simulation <strong>'{this.state.modalSimulation.name}'</strong>?
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

export default Container.create(Simulations);
