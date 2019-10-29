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

import AppDispatcher from '../common/app-dispatcher';
import ProjectStore from './project-store';
import UserStore from '../user/user-store';
import DashboardStore from '../dashboard/dashboard-store';
import SimulationStore from '../simulation/simulation-store';

import Icon from '../common/icon';
import CustomTable from '../common/table';
import TableColumn from '../common/table-column';
import NewVisualzationDialog from '../dashboard/new-dashboard';
import EditDashboardDialog from '../dashboard/edit-dashboard';
import ImportDashboardDialog from '../dashboard/import-dashboard';

import DeleteDialog from '../common/dialogs/delete-dialog';

class Dashboards extends Component {
  static getStores() {
    return [ ProjectStore, DashboardStore, UserStore, SimulationStore ];
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

    // load dashboards
    let dashboards = [];

    if (project.dashboards != null) {
      dashboards = DashboardStore.getState().filter(dashboard => project.dashboards.includes(dashboard._id));
    }

    return {
      dashboards,
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
      type: 'dashboards/start-load',
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
      // add project to dashboard
      data.project = this.state.project._id;

      AppDispatcher.dispatch({
        type: 'dashboards/start-add',
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
      type: 'dashboards/start-remove',
      data: this.state.modalData,
      token: this.state.sessionToken
    });
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'dashboards/start-edit',
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
        type: 'dashboards/start-add',
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

  exportDashboard(index) {
    // filter properties
    let dashboard = Object.assign({}, this.state.dashboards[index]);
    delete dashboard._id;
    delete dashboard.project;
    delete dashboard.user;

    dashboard.widgets.forEach(widget => {
      delete widget.simulator;
    });

    // show save dialog
    const blob = new Blob([JSON.stringify(dashboard, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'dashboard - ' + dashboard.name + '.json');
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

        <CustomTable data={this.state.dashboards}>
          <TableColumn title='Name' dataKey='name' link='/dashboards/' linkKey='_id' />
          <TableColumn
            width='100'
            editButton
            deleteButton
            exportButton
            onEdit={(index) => this.setState({ editModal: true, modalData: this.state.dashboards[index] })}
            onDelete={(index) => this.setState({ deleteModal: true, modalData: this.state.dashboards[index] })}
            onExport={index => this.exportDashboard(index)}
          />
        </CustomTable>

        <Button onClick={() => this.setState({ newModal: true })} style={buttonStyle}><Icon icon="plus" /> Dashboard</Button>
        <Button onClick={() => this.setState({ importModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>

        <NewVisualzationDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />
        <EditDashboardDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} dashboard={this.state.modalData} />
        <ImportDashboardDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} simulation={this.state.simulation} />

        <DeleteDialog title="dashboard" name={this.state.modalData.name} show={this.state.deleteModal} onClose={this.closeDeleteModal} />
      </div>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Dashboards), {withProps: true});
