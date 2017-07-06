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
//import SimulatorStore from '../stores/simulator-store';
import NodeStore from '../stores/node-store';

import NewNodeDialog from '../components/dialog/new-node';
import EditNodeDialog from '../components/dialog/edit-node';
import NodeTree from '../components/node-tree';

class Simulators extends Component {
  static getStores() {
    return [ NodeStore ];
  }

  static calculateState() {
    return {
      nodes: NodeStore.getState(),

      newModal: false,
      deleteModal: false,
      editModal: false,
      modalData: {}
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'nodes/start-load'
    });
  }

  closeNewModal(data) {
    this.setState({ newModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'nodes/start-add',
        data: data
      });
    }
  }

  showEditModal(data) {
    // find node with id
    var node = this.state.nodes.find((element) => {
      return element._id === data.id;
    });

    this.setState({ editModal: true, modalData: node });
  }

  closeEditModal(data) {
    this.setState({ editModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'nodes/start-edit',
        data: data
      });
    }
  }

  showDeleteModal(data) {
    // find node with id
    var node = this.state.nodes.find((element) => {
      return element._id === data.id;
    });

    this.setState({ deleteModal: true, modalData: node });
  }

  confirmDeleteModal() {
    this.setState({ deleteModal: false });

    AppDispatcher.dispatch({
      type: 'nodes/start-remove',
      data: this.state.modalData
    });
  }

  render() {
    return (
      <div className='section'>
        <h1>Simulators</h1>

        <Button onClick={() => this.setState({ newModal: true })}><Glyphicon glyph="plus" /> Add Node</Button>

        <NodeTree data={this.state.nodes} onDelete={(node) => this.showDeleteModal(node)} onEdit={(node) => this.showEditModal(node)} />

        <NewNodeDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />
        <EditNodeDialog node={this.state.modalData} show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} />

        <Modal show={this.state.deleteModal}>
          <Modal.Header>
            <Modal.Title>Delete Node</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the node <strong>'{this.state.modalData.name}'</strong>?
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
