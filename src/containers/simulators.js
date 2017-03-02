/**
 * File: simulators.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { Button, Modal } from 'react-bootstrap';

import AppDispatcher from '../app-dispatcher';
import SimulatorStore from '../stores/simulator-store';

import ControlTable from '../components/table-control';
import NewSimulatorDialog from '../components/dialog-new-simulator';
import EditSimulatorDialog from '../components/dialog-edit-simulator';

class Simulators extends Component {
  constructor(props) {
    super(props);

    this.showNewModal = this.showNewModal.bind(this);
    this.closeNewModal = this.closeNewModal.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.confirmDeleteModal = this.confirmDeleteModal.bind(this);
    this.cancelDeleteModal = this.cancelDeleteModal.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
  }

  static getStores() {
    return [ SimulatorStore ];
  }

  static calculateState() {
    return {
      simulators: SimulatorStore.getState(),

      newModal: false,
      deleteModal: false,
      editModal: false,
      modalSimulator: {}
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'simulators/start-load'
    });
  }

  showNewModal() {
    this.setState({ newModal: true });
  }

  closeNewModal(data) {
    this.setState({ newModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'simulators/start-add',
        simulator: data
      });
    }
  }

  showDeleteModal(id) {
    // get simulator by id
    var deleteSimulator;

    this.state.simulators.forEach((simulator) => {
      if (simulator._id === id) {
        deleteSimulator = simulator;
      }
    });

    this.setState({ deleteModal: true, modalSimulator: deleteSimulator });
  }

  cancelDeleteModal() {
    this.setState({ deleteModal: false });
  }

  confirmDeleteModal() {
    this.setState({ deleteModal: false });

    AppDispatcher.dispatch({
      type: 'simulators/start-remove',
      simulator: this.state.modalSimulator
    });
  }

  showEditModal(id) {
    // get simulator by id
    var editSimulator;

    this.state.simulators.forEach((simulator) => {
      if (simulator._id === id) {
        editSimulator = simulator;
      }
    });

    this.setState({ editModal: true, modalSimulator: editSimulator });
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'simulators/start-edit',
        simulator: data
      });
    }
  }

  render() {
    var columns = [
      { title: 'Name', key: 'name' },
      { title: 'ID', key: 'simulatorid', width: 80 },
      { title: 'Running', key: 'running', width: 80 },
      { title: 'Endpoint', key: 'endpoint', width: 120 }
    ];

    return (
      <div>
        <h1>Simulators</h1>

        <ControlTable columns={columns} data={this.state.simulators} width='100%' onEdit={this.showEditModal} onDelete={this.showDeleteModal} />

        <Button onClick={this.showNewModal}>New Simulator</Button>

        <NewSimulatorDialog show={this.state.newModal} onClose={this.closeNewModal} />

        <EditSimulatorDialog show={this.state.editModal} onClose={this.closeEditModal} simulator={this.state.modalSimulator} />

        <Modal show={this.state.deleteModal}>
          <Modal.Header>
            <Modal.Title>Delete Simulator</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the simulator <strong>'{this.state.modalSimulator.name}'</strong>?
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.cancelDeleteModal}>Cancel</Button>
            <Button bsStyle="danger" onClick={this.confirmDeleteModal}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Container.create(Simulators);
