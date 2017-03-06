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
import { Button, Modal, Glyphicon } from 'react-bootstrap';

import AppDispatcher from '../app-dispatcher';
import VisualizationStore from '../stores/visualization-store';

import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewVisualzationDialog from '../components/dialog/new-visualization';
import EditVisualizationDialog from '../components/dialog/edit-visualization';

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
      modalData: {}
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

  confirmDeleteModal() {
    this.setState({ deleteModal: false });

    AppDispatcher.dispatch({
      type: 'visualizations/start-remove',
      data: this.state.modalVisualization
    });
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
    return (
      <div>
        <h1>Visualizations</h1>

        <Table data={this.state.visualizations}>
          <TableColumn title='Name' dataKey='name' link='/visualizations/' linkKey='_id' />
          <TableColumn width='70' editButton deleteButton onEdit={index => this.setState({ editModal: true, modalData: this.state.visualizations[index] })} onDelete={index => this.setState({ deleteModal: true, modalData: this.state.visualizations[index] })} />
        </Table>

        <Button onClick={() => this.setState({ newModal: true })}><Glyphicon glyph="plus" /> Visualization</Button>

        <NewVisualzationDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />

        <EditVisualizationDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} visualization={this.state.modalData} />

        <Modal show={this.state.deleteModal}>
          <Modal.Header>
            <Modal.Title>Delete Visualization</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the visualization <strong>'{this.state.modalData.name}'</strong>?
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
