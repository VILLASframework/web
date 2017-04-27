/**
 * File: simulators.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
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

  labelStyle(value) {
    if (value === true) return 'success';
    else return 'warning';
  }

  labelModifier(value) {
    if (value === true) return 'Running';
    else return 'Not running';
  }

  render() {
    return (
      <div>
        <h1>Simulators</h1>

        <Table data={this.state.simulators}>
          <TableColumn title='Name' dataKey='name' labelKey='running' labelStyle={(value) => this.labelStyle(value)} labelModifier={(value) => this.labelModifier(value)} />
          <TableColumn title='Endpoint' dataKey='endpoint' width='180' />
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
