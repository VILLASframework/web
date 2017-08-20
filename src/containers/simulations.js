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
import { Button, Modal, Glyphicon } from 'react-bootstrap';

import AppDispatcher from '../app-dispatcher';
import SimulationStore from '../stores/simulation-store';
import UserStore from '../stores/user-store';

import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewSimulationDialog from '../components/dialog/new-simulation';
import EditSimulationDialog from '../components/dialog/edit-simulation';

class Simulations extends Component {
  static getStores() {
    return [ SimulationStore, UserStore ];
  }

  static calculateState() {
    return {
      simulations: SimulationStore.getState(),
      sessionToken: UserStore.getState().token,

      newModal: false,
      deleteModal: false,
      editModal: false,
      modalSimulation: {}
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'simulations/start-load',
      token: this.state.sessionToken
    });
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

  confirmDeleteModal() {
    this.setState({ deleteModal: false });

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

    if (data) {
      AppDispatcher.dispatch({
        type: 'simulations/start-edit',
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

  render() {
    return (
      <div className='section'>
        <h1>Simulations</h1>

        <Table data={this.state.simulations}>
          <TableColumn title='Name' dataKey='name' link='/simulations/' linkKey='_id' />
          <TableColumn width='70' editButton deleteButton onEdit={index => this.setState({ editModal: true, modalSimulation: this.state.simulations[index] })} onDelete={index => this.setState({ deleteModal: true, modalSimulation: this.state.simulations[index] })} />
        </Table>

        <Button onClick={() => this.setState({ newModal: true })}><Glyphicon glyph="plus" /> Simulation</Button>

        <NewSimulationDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />

        <EditSimulationDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} simulation={this.state.modalSimulation} />

        <Modal keyboard show={this.state.deleteModal} onHide={() => this.setState({ deleteModal: false })} onKeyPress={this.onModalKeyPress}>
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
