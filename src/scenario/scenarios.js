/**
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
import ScenarioStore from './scenario-store';
import LoginStore from '../user/login-store';

import Icon from '../common/icon';
import Table from '../common/table';
import TableColumn from '../common/table-column';
import NewScenarioDialog from './new-scenario';
import EditScenarioDialog from './edit-scenario';
import ImportScenarioDialog from './import-scenario';

import DeleteDialog from '../common/dialogs/delete-dialog';

class Scenarios extends Component {
  static getStores() {
    return [ ScenarioStore, LoginStore ];
  }

  static calculateState() {
    const scenarios = ScenarioStore.getState();
    const sessionToken = LoginStore.getState().token;

    return {
      scenarios,
      sessionToken,

      newModal: false,
      deleteModal: false,
      editModal: false,
      importModal: false,
      modalScenario: {},

      selectedScenarios: []
    };
  }

  componentDidMount() {
    AppDispatcher.dispatch({
      type: 'scenarios/start-load',
      token: this.state.sessionToken
    });
  }

  componentDidUpdate() {}

  closeNewModal(data) {
    this.setState({ newModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'scenarios/start-add',
        data,
        token: this.state.sessionToken
      });
    }
  }

  showDeleteModal(id) {
    // get scenario by id
    var deleteScenario;

    this.state.scenarios.forEach((scenario) => {
      if (scenario.id === id) {
        deleteScenario = scenario;
      }
    });

    this.setState({ deleteModal: true, modalScenario: deleteScenario });
  }

  closeDeleteModal(confirmDelete) {
    this.setState({ deleteModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'scenarios/start-remove',
      data: this.state.modalScenario,
      token: this.state.sessionToken
    });
  };

  showEditModal(id) {
    // get scenario by id
    var editScenario;

    this.state.scenarios.forEach((scenario) => {
      if (scenario.id === id) {
        editScenario = scenario;
      }
    });

    this.setState({ editModal: true, modalScenario: editScenario });
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data != null) {
      AppDispatcher.dispatch({
        type: 'scenarios/start-edit',
        data,
        token: this.state.sessionToken
      });
    }
  }

  closeImportModal(data) {
    this.setState({ importModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'scenarios/start-add',
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
  };

  exportScenario(index) {
    // filter properties
    let scenario = Object.assign({}, this.state.scenarios[index]);
    delete scenario.id;

    // TODO request missing scenario parameters (Dashboards and component configs) recursively for export

    // show save dialog
    const blob = new Blob([JSON.stringify(scenario, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'scenario - ' + scenario.name + '.json');
  }


  render() {
    const buttonStyle = {
      marginLeft: '10px'
    };

    return (
      <div className='section'>
        <h1>Scenarios</h1>

        <Table data={this.state.scenarios}>
          <TableColumn title='Name' dataKey='name' link='/scenarios/' linkKey='id' />
          <TableColumn title='ID' dataKey='id' />
          <TableColumn title='Running' dataKey='running' />
          <TableColumn
            width='200'
            editButton
            deleteButton
            exportButton
            onEdit={index => this.setState({ editModal: true, modalScenario: this.state.scenarios[index] })}
            onDelete={index => this.setState({ deleteModal: true, modalScenario: this.state.scenarios[index] })}
            onExport={index => this.exportScenario(index)}
          />
        </Table>

        <div style={{ float: 'right' }}>
          <Button onClick={() => this.setState({ newModal: true })} style={buttonStyle}><Icon icon="plus" /> Scenario</Button>
          <Button onClick={() => this.setState({ importModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>
        </div>

        <div style={{ clear: 'both' }} />

        <NewScenarioDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />
        <EditScenarioDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} scenario={this.state.modalScenario} />
        <ImportScenarioDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} nodes={this.state.nodes} />

        <DeleteDialog title="scenario" name={this.state.modalScenario.name} show={this.state.deleteModal} onClose={(e) => this.closeDeleteModal(e)} />
      </div>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Scenarios));
