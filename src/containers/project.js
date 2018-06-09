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
import { Button } from 'react-bootstrap';
import FileSaver from 'file-saver';

import AppDispatcher from '../app-dispatcher';
import ProjectStore from '../stores/project-store';
import UserStore from '../stores/user-store';
import VisualizationStore from '../stores/visualization-store';
import SimulationStore from '../stores/simulation-store';

import Icon from '../components/icon';
import CustomTable from '../components/table';
import TableColumn from '../components/table-column';
import NewVisualzationDialog from '../components/dialog/new-visualization';
import EditVisualizationDialog from '../components/dialog/edit-visualization';
import ImportVisualizationDialog from '../components/dialog/import-visualization';

import DeleteDialog from '../components/dialog/delete-dialog';

class Visualizations extends Component {
  static getStores() {
    return [ ProjectStore, VisualizationStore, UserStore, SimulationStore ];
  }

  static calculateState(prevState, props) {
    prevState = prevState || {};

    // load project
    const sessionToken = UserStore.getState().token;

    let project = ProjectStore.getState().find(project => project._id === props.match.params.project);
    if (project == null) {
      AppDispatcher.dispatch({
        type: 'projects/start-load',
        data: props.match.params.project,
        token: sessionToken
      });

      project = {};
    }

    // load simulation
    let simulation = {};

    if (project.simulation != null) {
      simulation = SimulationStore.getState().find(simulation => simulation._id === project.simulation);
    }

    // load visualizations
    let visualizations = [];

    if (project.visualizations != null) {
      visualizations = VisualizationStore.getState().filter(visualization => project.visualizations.includes(visualization._id));
    }

    return {
      visualizations,
      project,
      simulation,
      sessionToken,

      newModal: prevState.newModal || false,
      deleteModal: prevState.deleteModal || false,
      editModal: prevState.editModal || false,
      importModal: prevState.importModal || false,
      modalData: prevState.modalData || {}
    };
  }

  componentDidMount() {
    AppDispatcher.dispatch({
      type: 'visualizations/start-load',
      token: this.state.sessionToken
    });

    AppDispatcher.dispatch({
      type: 'simulations/start-load',
      token: this.state.sessionToken
    });
  }

  closeNewModal(data) {
    this.setState({ newModal: false });

    if (data) {
      // add project to visualization
      data.project = this.state.project._id;

      AppDispatcher.dispatch({
        type: 'visualizations/start-add',
        data: data,
        token: this.state.sessionToken
      });

      this.setState({ project: {} }, () => {
        AppDispatcher.dispatch({
          type: 'projects/start-load',
          data: this.props.match.params.project,
          token: this.state.sessionToken
        });
      });
    }
  }

  closeDeleteModal = confirmDelete => {
    this.setState({ deleteModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'visualizations/start-remove',
      data: this.state.modalData,
      token: this.state.sessionToken
    });
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'visualizations/start-edit',
        data: data,
        token: this.state.sessionToken
      });
    }
  }

  closeImportModal(data) {
    this.setState({ importModal: false });

    if (data) {
      data.project = this.state.project._id;

      AppDispatcher.dispatch({
        type: 'visualizations/start-add',
        data,
        token: this.state.sessionToken
      });

      this.setState({ project: {} }, () => {
        AppDispatcher.dispatch({
          type: 'projects/start-load',
          data: this.props.match.params.project,
          token: this.state.sessionToken
        });
      });
    }
  }

  exportVisualization(index) {
    // filter properties
    let visualization = Object.assign({}, this.state.visualizations[index]);
    delete visualization._id;
    delete visualization.project;
    delete visualization.user;

    visualization.widgets.forEach(widget => {
      delete widget.simulator;
    });

    // show save dialog
    const blob = new Blob([JSON.stringify(visualization, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'visualization - ' + visualization.name + '.json');
  }

  onModalKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      this.confirmDeleteModal();
    }
  }

  render() {
    const buttonStyle = {
      marginRight: '10px'
    };

    return (
      <div className='section'>
        <h1>{this.state.project.name}</h1>

        <CustomTable data={this.state.visualizations}>
          <TableColumn title='Name' dataKey='name' link='/visualizations/' linkKey='_id' />
          <TableColumn
            width='100'
            editButton
            deleteButton
            exportButton
            onEdit={(index) => this.setState({ editModal: true, modalData: this.state.visualizations[index] })}
            onDelete={(index) => this.setState({ deleteModal: true, modalData: this.state.visualizations[index] })}
            onExport={index => this.exportVisualization(index)}
          />
        </CustomTable>

        <Button onClick={() => this.setState({ newModal: true })} style={buttonStyle}><Icon icon="plus" /> Visualization</Button>
        <Button onClick={() => this.setState({ importModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>

        <NewVisualzationDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />
        <EditVisualizationDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} visualization={this.state.modalData} />
        <ImportVisualizationDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} simulation={this.state.simulation} />

        <DeleteDialog title="visualization" name={this.state.modalData.name} show={this.state.deleteModal} onClose={this.closeDeleteModal} />
      </div>
    );
  }
}

export default Container.create(Visualizations, {withProps: true});
