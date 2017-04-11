/**
 * File: project.js
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
import ProjectStore from '../stores/project-store';
import VisualizationStore from '../stores/visualization-store';

import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewVisualzationDialog from '../components/dialog/new-visualization';
import EditVisualizationDialog from '../components/dialog/edit-visualization';

class Visualizations extends Component {
  static getStores() {
    return [ ProjectStore, VisualizationStore ];
  }

  static calculateState(prevState) {
    if (prevState) {
      return {
        projects: ProjectStore.getState(),
        visualizations: VisualizationStore.getState(),

        newModal: prevState.newModal,
        deleteModal: prevState.deleteModal,
        editModal: prevState.editModal,
        modalData: prevState.modalData,

        project: prevState.project,
        reload: prevState.reload
      };
    } else {
      return {
        projects: ProjectStore.getState(),
        visualizations: VisualizationStore.getState(),

        newModal: false,
        deleteModal: false,
        editModal: false,
        modalData: {},

        project: {},
        reload: false
      };
    }
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'projects/start-load'
    });
  }

  componentDidUpdate() {
    if (this.state.project._id !== this.props.params.project /*|| this.state.reload*/) {
      this.reloadProject();

      if (this.state.reload) {
        this.setState({ reload: false });
      }
    }
  }

  reloadProject() {
    // select project by param id
    this.state.projects.forEach((project) => {
      if (project._id === this.props.params.project) {
        // JSON.parse(JSON.stringify(obj)) = deep clone to make also copy of widget objects inside
        this.setState({ project: JSON.parse(JSON.stringify(project)) });

        // load visualizations
        AppDispatcher.dispatch({
          type: 'visualizations/start-load',
          data: project.visualizations
        });
      }
    });
  }

  closeNewModal(data) {
    if (data) {
      // add project to visualization
      data.project = this.state.project._id;

      AppDispatcher.dispatch({
        type: 'visualizations/start-add',
        data: data
      });
    }

    this.setState({ newModal: false, reload: data != null });
  }

  confirmDeleteModal() {
    this.setState({ deleteModal: false });

    AppDispatcher.dispatch({
      type: 'visualizations/start-remove',
      data: this.state.modalData
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
    // get visualizations for this project
    var visualizations = [];

    if (this.state.visualizations && this.state.project.visualizations) {
      visualizations = this.state.visualizations.filter( 
          (visualization) => this.state.project.visualizations.includes(visualization._id)
        ).sort(
          (visA, visB) => visA.name.localeCompare(visB.name)
        );
    }

    return (
      <div>
        <h1>{this.state.project.name}</h1>

        <Table data={visualizations}>
          <TableColumn title='Name' dataKey='name' link='/visualizations/' linkKey='_id' />
          <TableColumn width='70' editButton deleteButton onEdit={(index) => this.setState({ editModal: true, modalData: visualizations[index] })} onDelete={(index) => this.setState({ deleteModal: true, modalData: visualizations[index] })} />
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
