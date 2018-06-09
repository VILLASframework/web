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
import { Button } from 'react-bootstrap';
import FileSaver from 'file-saver';
import _ from 'lodash';

import AppDispatcher from '../app-dispatcher';
import SimulatorStore from '../stores/simulator-store';
import UserStore from '../stores/user-store';

import Icon from '../components/icon';
import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewSimulatorDialog from '../components/dialog/new-simulator';
import EditSimulatorDialog from '../components/dialog/edit-simulator';
import ImportSimulatorDialog from '../components/dialog/import-simulator';

import SimulatorAction from '../components/simulator-action';
import DeleteDialog from '../components/dialog/delete-dialog';

class Simulators extends Component {
  static getStores() {
    return [ UserStore, SimulatorStore ];
  }

  static calculateState() {
    const simulators = SimulatorStore.getState().sort((a, b) => {
      return a.stateUpdatedAt < b.stateUpdatedAt;
    });

    return {
      sessionToken: UserStore.getState().token,
      simulators,
      modalSimulator: {},
      deleteModal: false,

      selectedSimulators: []
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'simulators/start-load',
      token: this.state.sessionToken
    });
  }

  closeNewModal(data) {
    this.setState({ newModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'simulators/start-add',
        data,
        token: this.state.sessionToken
      });
    }
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data) {
      let simulator = this.state.simulators[this.state.modalIndex];
      simulator.properties = data;
      this.setState({ simulator });

      AppDispatcher.dispatch({
        type: 'simulators/start-edit',
        data: simulator,
        token: this.state.sessionToken
      });
    }
  }

  closeDeleteModal = confirmDelete => {
    this.setState({ deleteModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'simulators/start-remove',
      data: this.state.modalSimulator,
      token: this.state.sessionToken
    });
  }

  exportSimulator(index) {
    // filter properties
    let simulator = Object.assign({}, this.state.simulators[index]);
    delete simulator._id;

    // show save dialog
    const blob = new Blob([JSON.stringify(simulator, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'simulator - ' + (_.get(simulator, 'properties.name') || _.get(simulator, 'rawProperties.name') || 'undefined') + '.json');
  }

  closeImportModal(data) {
    this.setState({ importModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'simulators/start-add',
        data,
        token: this.state.sessionToken
      });
    }
  }

  onSimulatorChecked(index, event) {
    const selectedSimulators = Object.assign([], this.state.selectedSimulators);
    for (let key in selectedSimulators) {
      if (selectedSimulators[key] === index) {
        // update existing entry
        if (event.target.checked) {
          return;
        }

        selectedSimulators.splice(key, 1);

        this.setState({ selectedSimulators });
        return;
      }
    }

    // add new entry
    if (event.target.checked === false) {
      return;
    }

    selectedSimulators.push(index);
    this.setState({ selectedSimulators });
  }

  runAction = action => {
    for (let index of this.state.selectedSimulators) {
      AppDispatcher.dispatch({
        type: 'simulators/start-action',
        simulator: this.state.simulators[index],
        data: action.data,
        token: this.state.sessionToken
      });
    }
  }

  isSimulatorOutdated(simulator) {
    if (!simulator.stateUpdatedAt)
      return true;

    const fiveMinutes = 5 * 60 * 1000;

    return Date.now() - new Date(simulator.stateUpdatedAt) > fiveMinutes;
  }

  isSimulatorOnline(state) {
    return state !== '' && state !== 'shutdown' && state !== 'unknown';
  }

  stateLabelStyle = (state, simulator) => {
    if (this.isSimulatorOutdated(simulator)) {
      return 'default';
    }

    if (this.isSimulatorOnline(state)) {
      return 'success';
    }

    return 'danger';
  }

  stateLabelModifier = (state, simulator) => {
    if (this.isSimulatorOutdated(simulator)) {
      return 'unknown';
    }

    if (this.isSimulatorOnline(state)) {
      return 'online';
    }

    return 'offline';
  }

  stateUpdateModifier = updatedAt => {
    const date = new Date(updatedAt);

    return date.toLocaleString('de-DE');
  }

  render() {
    const buttonStyle = {
      marginLeft: '10px'
    };

    return (
      <div className='section'>
        <h1>Simulators</h1>

        <Table data={this.state.simulators}>
          <TableColumn checkbox onChecked={(index, event) => this.onSimulatorChecked(index, event)} width='30' />
          <TableColumn title='Name' dataKeys={['properties.name', 'rawProperties.name']} />
          <TableColumn title='State' dataKey='state' labelKey='state' labelModifier={this.stateLabelModifier} labelStyle={this.stateLabelStyle} />
          <TableColumn title='Type' dataKeys={['properties.type', 'rawProperties.type']} />
          <TableColumn title='Location' dataKeys={['properties.location', 'rawProperties.location']} />
          <TableColumn title='Realm' dataKeys={['properties.realm', 'rawProperties.realm']} />
          <TableColumn title='Host' dataKey='host' />
          <TableColumn title='Last Update' dataKey='stateUpdatedAt' modifier={this.stateUpdateModifier} />
          <TableColumn
            width='100'
            editButton
            exportButton
            deleteButton
            onEdit={index => this.setState({ editModal: true, modalSimulator: this.state.simulators[index], modalIndex: index })}
            onExport={index => this.exportSimulator(index)}
            onDelete={index => this.setState({ deleteModal: true, modalSimulator: this.state.simulators[index], modalIndex: index })}
          />
        </Table>

        <div style={{ float: 'left' }}>
          <SimulatorAction
            runDisabled={this.state.selectedSimulators.length === 0}
            runAction={this.runAction}
            actions={[ { id: '0', title: 'Reset', data: { action: 'reset' } }, { id: '1', title: 'Shutdown', data: { action: 'shutdown' } } ]}/>
        </div>

        <div style={{ float: 'right' }}>
          <Button onClick={() => this.setState({ newModal: true })} style={buttonStyle}><Icon icon="plus" /> Simulator</Button>
          <Button onClick={() => this.setState({ importModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>
        </div>

        <div style={{ clear: 'both' }} />

        <NewSimulatorDialog show={this.state.newModal} onClose={data => this.closeNewModal(data)} />
        <EditSimulatorDialog show={this.state.editModal} onClose={data => this.closeEditModal(data)} simulator={this.state.modalSimulator} />
        <ImportSimulatorDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} />

        <DeleteDialog title="simulator" name={_.get(this.state.modalSimulator, 'properties.name') || _.get(this.state.modalSimulator, 'rawProperties.name') || 'Unknown'} show={this.state.deleteModal} onClose={this.closeDeleteModal} />
      </div>
    );
  }
}

export default Container.create(Simulators);
