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
import NodeStore from '../stores/node-store';

import NewNodeDialog from '../components/dialog/new-node';
import EditNodeDialog from '../components/dialog/edit-node';
import NewSimulatorDialog from '../components/dialog/new-simulator';
import EditSimulatorDialog from '../components/dialog/edit-simulator';
import NodeTree from '../components/node-tree';

class Simulators extends Component {
  static getStores() {
    return [ NodeStore ];
  }

  static calculateState() {
    return {
      nodes: NodeStore.getState(),

      newNodeModal: false,
      deleteNodeModal: false,
      editNodeModal: false,

      addSimulatorModal: false,
      editSimulatorModal: false,
      deleteSimulatorModal: false,

      modalData: {},
      modalIndex: 0,
      modalName: ''
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'nodes/start-load'
    });
  }

  closeNewNodeModal(data) {
    this.setState({ newNodeModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'nodes/start-add',
        data: data
      });
    }
  }

  showEditNodeModal(data) {
    // find node with id
    var node = this.state.nodes.find((element) => {
      return element._id === data.id;
    });

    this.setState({ editNodeModal: true, modalData: node });
  }

  closeEditNodeModal(data) {
    this.setState({ editNodeModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'nodes/start-edit',
        data: data
      });
    }
  }

  showDeleteNodeModal(data) {
    // find node with id
    var node = this.state.nodes.find((element) => {
      return element._id === data.id;
    });

    this.setState({ deleteNodeModal: true, modalData: node });
  }

  confirmDeleteNodeModal() {
    this.setState({ deleteModal: false });

    AppDispatcher.dispatch({
      type: 'nodes/start-remove',
      data: this.state.modalData
    });
  }

  showAddSimulatorModal(data) {
    // find node with id
    var node = this.state.nodes.find((element) => {
      return element._id === data.id;
    });

    this.setState({ addSimulatorModal: true, modalData: node });
  }

  closeAddSimulatorModal(data) {
    this.setState({ addSimulatorModal: false });

    if (data) {
      var node = this.state.modalData;
      node.simulators.push(data);

      AppDispatcher.dispatch({
        type: 'nodes/start-edit',
        data: node
      });
    }
  }

  showEditSimulatorModal(data, index) {
    // find node with id
    var node = this.state.nodes.find((element) => {
      return element._id === data.id;
    });

    this.setState({ editSimulatorModal: true, modalData: node, modalIndex: index });
  }

  closeEditSimulatorModal(data) {
    this.setState({ editSimulatorModal: false });

    if (data) {
      var node = this.state.modalData;
      node.simulators[this.state.modalIndex] = data;

      AppDispatcher.dispatch({
        type: 'nodes/start-edit',
        data: node
      });
    }
  }

  showDeleteSimulatorModal(data, index) {
    // find node with id
    var node = this.state.nodes.find((element) => {
      return element._id === data.id;
    });

    this.setState({ deleteSimulatorModal: true, modalData: node, modalIndex: index, modalName: data.children[index].title });
  }

  confirmDeleteSimulatorModal() {
    this.setState({ deleteSimulatorModal: false });

    // remove simulator
    var node = this.state.modalData;
    node.simulators.splice(this.state.modalIndex);

    AppDispatcher.dispatch({
      type: 'nodes/start-edit',
      data: node
    });
  }

  onTreeDataChange(nodes) {
    // update all at once
    nodes.forEach((node) => {
      AppDispatcher.dispatch({
        type: 'nodes/start-edit',
        data: node
      });
    });
  }

  render() {
    return (
      <div className='section'>
        <h1>Simulators</h1>

        <Button onClick={() => this.setState({ newNodeModal: true })}><Glyphicon glyph="plus" /> Add Node</Button>

        <NodeTree data={this.state.nodes} onDataChange={(treeData) => this.onTreeDataChange(treeData)} onNodeDelete={(node) => this.showDeleteNodeModal(node)} onNodeEdit={(node) => this.showEditNodeModal(node)} onNodeAdd={(node) => this.showAddSimulatorModal(node)} onSimulatorEdit={(node, index) => this.showEditSimulatorModal(node, index)} onSimulatorDelete={(node, index) => this.showDeleteSimulatorModal(node, index)} />

        <NewNodeDialog show={this.state.newNodeModal} onClose={(data) => this.closeNewNodeModal(data)} />
        <EditNodeDialog node={this.state.modalData} show={this.state.editNodeModal} onClose={(data) => this.closeEditNodeModal(data)} />
        <NewSimulatorDialog show={this.state.addSimulatorModal} onClose={(data) => this.closeAddSimulatorModal(data)} />

        {this.state.editSimulatorModal &&
          <EditSimulatorDialog simulator={this.state.modalData.simulators[this.state.modalIndex]} show={this.state.editSimulatorModal} onClose={(data) => this.closeEditSimulatorModal(data)} />
        }

        <Modal show={this.state.deleteNodeModal}>
          <Modal.Header>
            <Modal.Title>Delete Node</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the node <strong>'{this.state.modalData.name}'</strong>?
            <br />
            This will delete all simulators assigned to this node.
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={() => this.setState({ deleteNodeModal: false })}>Cancel</Button>
            <Button bsStyle="danger" onClick={() => this.confirmDeleteNodeModal()}>Delete</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.deleteSimulatorModal}>
          <Modal.Header>
            <Modal.Title>Delete Simulator</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the simulator <strong>'{this.state.modalName}'</strong>?
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={() => this.setState({ deleteSimulatorModal: false })}>Cancel</Button>
            <Button bsStyle="danger" onClick={() => this.confirmDeleteSimulatorModal()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Container.create(Simulators);
