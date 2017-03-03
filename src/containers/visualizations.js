/**
 * File: visualizations.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { Button, Modal } from 'react-bootstrap';

import AppDispatcher from '../app-dispatcher';
import VisualizationStore from '../stores/visualization-store';

import ControlLinkTable from '../components/table-control-link';
import NewVisualzationDialog from '../components/dialog-new-visualization';
import EditVisualizationDialog from '../components/dialog-edit-visualization';

class Visualizations extends Component {
  static getStores() {
    return [ VisualizationStore ];
  }

  static calculateState() {
    return {
      visualizations: VisualizationStore.getState(),

      newModal: false,
      deleteModal: false,
      editModal: false,
      modalVisualization: {}
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'visualizations/start-load'
    });
  }

  closeNewModal(data) {
    this.setState({ newModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'visualizations/start-add',
        data: data
      });
    }
  }

  showDeleteModal(id) {
    // get visualization by id
    var deleteVisualization;

    this.state.visualizations.forEach((visualization) => {
      if (visualization._id === id) {
        deleteVisualization = visualization;
      }
    });

    this.setState({ deleteModal: true, modalVisualization: deleteVisualization });
  }

  confirmDeleteModal() {
    this.setState({ deleteModal: false });

    AppDispatcher.dispatch({
      type: 'visualizations/start-remove',
      data: this.state.modalVisualization
    });
  }

  showEditModal(id) {
    // get visualization by id
    var editVisualization;

    this.state.visualizations.forEach((visualization) => {
      if (visualization._id === id) {
        editVisualization = visualization;
      }
    });

    this.setState({ editModal: true, modalVisualization: editVisualization });
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'visualizations/start-edit',
        data: data
      });
    }
  }

  render() {
    var columns = [
      { title: 'Name', key: 'name' }
    ];

    return (
      <div>
        <h1>Visualizations</h1>

        <ControlLinkTable columns={columns} data={this.state.visualizations} width='100%' onEdit={(id) => this.showEditModal(id)} onDelete={(id) => this.showDeleteModal(id)} linkRoot="/visualizations"/>

        <Button onClick={() => this.setState({ newModal: true })}>New Visualization</Button>

        <NewVisualzationDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />

        <EditVisualizationDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} visualization={this.state.modalVisualization} />

        <Modal show={this.state.deleteModal}>
          <Modal.Header>
            <Modal.Title>Delete Visualization</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the visualization <strong>'{this.state.modalVisualization.name}'</strong>?
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

export default Container.create(Visualizations);
