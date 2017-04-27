/**
 * File: project.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
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
import ProjectStore from '../stores/project-store';
import VisualizationStore from '../stores/visualization-store';

import CustomTable from '../components/table';
import TableColumn from '../components/table-column';
import NewVisualzationDialog from '../components/dialog/new-visualization';
import EditVisualizationDialog from '../components/dialog/edit-visualization';

class Visualizations extends Component {
  static getStores() {
    return [ ProjectStore, VisualizationStore ];
  }

  static calculateState(prevState, props) {

    let currentProjects = ProjectStore.getState();
    let currentVisualizations = VisualizationStore.getState();

    if (prevState) {
      var projectUpdate = prevState.project;

      // Compare content of the visualizations array, reload projects if changed
      if (JSON.stringify(prevState.visualizations) !== JSON.stringify(currentVisualizations)) {
        Visualizations.loadProjects();
      }

      // Compare content of the projects array, update visualizations if changed
      if (JSON.stringify(prevState.projects) !== JSON.stringify(currentProjects)) {
        projectUpdate = Visualizations.findProjectInState(currentProjects, props.params.project);
        Visualizations.loadVisualizations(projectUpdate.visualizations);
      }

      return {
        projects: currentProjects,
        visualizations: currentVisualizations,

        newModal: prevState.newModal,
        deleteModal: prevState.deleteModal,
        editModal: prevState.editModal,
        modalData: prevState.modalData,

        project: projectUpdate
      };
    } else {

      let initialProject = Visualizations.findProjectInState(currentProjects, props.params.project);
      // If projects have been loaded already but visualizations not (redirect from Projects page)
      if (initialProject && (!currentVisualizations || currentVisualizations.length === 0)) {
        Visualizations.loadVisualizations(initialProject.visualizations);
      }

      return {
        projects: currentProjects,
        visualizations: currentVisualizations,

        newModal: false,
        deleteModal: false,
        editModal: false,
        modalData: {},

        project: initialProject || {}
      };
    }
  }

  static findProjectInState(projects, projectId) {
    return projects.find((project) => project._id === projectId);
  }

  static loadProjects() {
    AppDispatcher.dispatch({
      type: 'projects/start-load'
    });
  }

  static loadVisualizations(visualizations) {
    AppDispatcher.dispatch({
      type: 'visualizations/start-load',
      data: visualizations
    });
  }

  componentWillMount() {
    Visualizations.loadProjects();
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

    this.setState({ newModal: false });
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

        <CustomTable data={visualizations}>
          <TableColumn title='Name' dataKey='name' link='/visualizations/' linkKey='_id' />
          <TableColumn width='70' editButton deleteButton onEdit={(index) => this.setState({ editModal: true, modalData: visualizations[index] })} onDelete={(index) => this.setState({ deleteModal: true, modalData: visualizations[index] })} />
        </CustomTable>

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

export default Container.create(Visualizations, {withProps: true});
