/**
 * File: projects.js
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
import ProjectStore from '../stores/project-store';
import SimulationStore from '../stores/simulation-store';

import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewProjectDialog from '../components/dialog/new-project';
import EditProjectDialog from '../components/dialog/edit-project';

class Projects extends Component {
  static getStores() {
    return [ ProjectStore, SimulationStore ];
  }

  static calculateState() {
    return {
      projects: ProjectStore.getState(),
      simulations: SimulationStore.getState(),

      newModal: false,
      editModal: false,
      deleteModal: false,
      modalData: {}
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'projects/start-load'
    });

    AppDispatcher.dispatch({
      type: 'simulations/start-load'
    });
  }

  closeNewModal(data) {
    this.setState({ newModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'projects/start-add',
        data: data
      });
    }
  }

  confirmDeleteModal() {
    this.setState({ deleteModal: false });

    AppDispatcher.dispatch({
      type: 'projects/start-remove',
      data: this.state.modalData
    });
  }

  closeEditModal(data) {
    this.setState({ editModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'projects/start-edit',
        data: data
      });
    }
  }

  getSimulationName(id) {
    for (var i = 0; i < this.state.simulations.length; i++) {
      if (this.state.simulations[i]._id === id) {
        return this.state.simulations[i].name;
      }
    }

    return id;
  }

  render() {
    return (
      <div>
        <h1>Projects</h1>

        <Table data={this.state.projects}>
          <TableColumn title='Name' dataKey='name' link='/projects/' linkKey='_id' />
          <TableColumn title='Simulation' dataKey='simulation' modifier={(id) => this.getSimulationName(id)} />
          <TableColumn width='70' editButton deleteButton onEdit={index => this.setState({ editModal: true, modalData: this.state.projects[index] })} onDelete={index => this.setState({ deleteModal: true, modalData: this.state.projects[index] })} />
        </Table>

        <Button onClick={() => this.setState({ newModal: true })}><Glyphicon glyph='plus' /> Project</Button>

        <NewProjectDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} simulations={this.state.simulations} />

        <EditProjectDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} project={this.state.modalData} simulations={this.state.simulations} />

        <Modal show={this.state.deleteModal}>
          <Modal.Header>
            <Modal.Title>Delete Project</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the project <strong>'{this.state.modalData.name}'</strong>?
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={() => this.setState({ deleteModal: false})}>Cancel</Button>
            <Button bsStyle='danger' onClick={() => this.confirmDeleteModal()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Container.create(Projects);