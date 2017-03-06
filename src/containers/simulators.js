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
import { Button, Modal, Glyphicon } from 'react-bootstrap';

import AppDispatcher from '../app-dispatcher';
import SimulatorStore from '../stores/simulator-store';

import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewSimulatorDialog from '../components/dialog/new-simulator';
import EditSimulatorDialog from '../components/dialog/edit-simulator';

class Simulators extends Component {
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

  closeNewModal(data) {
    this.setState({ newModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'simulators/start-add',
        data: data
      });
    }
  }

  confirmDeleteModal() {
    this.setState({ deleteModal: false });

    AppDispatcher.dispatch({
      type: 'simulators/start-remove',
      data: this.state.modalSimulator
    });
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'simulators/start-edit',
        data: data
      });
    }
  }

  render() {
    return (
      <div>
        <h1>Simulators</h1>

        <Table data={this.state.simulators}>
          <TableColumn title='Name' dataKey='name' />
          <TableColumn title='ID' dataKey='simulatorid' width='80' />
          <TableColumn title='Running' dataKey='running' width='80' />
          <TableColumn title='Endpoint' dataKey='endpoint' width='120' />
          <TableColumn title='' width='70' editButton deleteButton onEdit={(index) => this.setState({ editModal: true, modalSimulator: this.state.simulators[index] })} onDelete={(index) => this.setState({ deleteModal: true, modalSimulator: this.state.simulators[index] })} />
        </Table>

        <Button onClick={() => this.setState({ newModal: true })}><Glyphicon glyph="plus" /> Simulator</Button>

        <NewSimulatorDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />

        <EditSimulatorDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} simulator={this.state.modalSimulator} />

        <Modal show={this.state.deleteModal}>
          <Modal.Header>
            <Modal.Title>Delete Simulator</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the simulator <strong>'{this.state.modalSimulator.name}'</strong>?
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

export default Container.create(Simulators);
