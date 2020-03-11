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
import _ from 'lodash';

import AppDispatcher from '../common/app-dispatcher';
import InfrastructureComponentStore from './ic-store';
import LoginStore from '../user/login-store';

import Icon from '../common/icon';
import Table from '../common/table';
import TableColumn from '../common/table-column';
import NewICDialog from './new-ic';
import EditICDialog from './edit-ic';
import ImportICDialog from './import-ic';

import ICAction from './ic-action';
import DeleteDialog from '../common/dialogs/delete-dialog';

class InfrastructureComponents extends Component {
  static getStores() {
    return [ LoginStore, InfrastructureComponentStore ];
  }

  static statePrio(state) {
    switch (state) {
      case 'running':
      case 'starting':
        return 1;
      case 'paused':
      case 'pausing':
      case 'resuming':
        return 2;
      case 'idle':
        return 3;
      case 'shutdown':
        return 4;
      case 'error':
        return 10;
      default:
        return 99;
    }
  }

  static calculateState() {
    const ics = InfrastructureComponentStore.getState().sort((a, b) => {
      if (a.state !== b.state) {
          return InfrastructureComponents.statePrio(a.state) > InfrastructureComponents.statePrio(b.state);
      }
      else if (a.name !== b.name) {
        return a.name < b.name;
      }
      else {
        return a.stateUpdatedAt < b.stateUpdatedAt;
      }
    });

    return {
      sessionToken: LoginStore.getState().token,
      ics: ics,
      modalIC: {},
      deleteModal: false,

      selectedICs: []
    };
  }

  componentDidMount() {
    AppDispatcher.dispatch({
      type: 'ic/start-load',
      token: this.state.sessionToken,
    });

    // Start timer for periodic refresh
    this.timer = window.setInterval(() => this.refresh(), 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  refresh() {

    if (this.state.editModal || this.state.deleteModal){
      // do nothing since a dialog is open at the moment
    }
    else {
      AppDispatcher.dispatch({
        type: 'ic/start-load',
        token: this.state.sessionToken,
      });
    }
  }


  closeNewModal(data) {
    this.setState({ newModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'ic/start-add',
        data,
        token: this.state.sessionToken,
      });
    }
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data) {
      let ic = this.state.ics[this.state.modalIndex];
      ic.properties = data;
      this.setState({ ic: ic });

      AppDispatcher.dispatch({
        type: 'ic/start-edit',
        data: ic,
        token: this.state.sessionToken,
      });
    }
  }

  closeDeleteModal(confirmDelete){
    this.setState({ deleteModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'ic/start-remove',
      data: this.state.modalIC,
      token: this.state.sessionToken,
    });
  }

  exportIC(index) {
    // filter properties
    let ic = Object.assign({}, this.state.ics[index]);
    delete ic.id;

    // show save dialog
    const blob = new Blob([JSON.stringify(ic, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'ic - ' + (_.get(ic, 'properties.name') || _.get(ic, 'rawProperties.name') || 'undefined') + '.json');
  }

  closeImportModal(data) {
    this.setState({ importModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'ic/start-add',
        data,
        token: this.state.sessionToken,
      });
    }
  }

  onICChecked(index, event) {
    const selectedICs = Object.assign([], this.state.selectedICs);
    for (let key in selectedICs) {
      if (selectedICs[key] === index) {
        // update existing entry
        if (event.target.checked) {
          return;
        }

        selectedICs.splice(key, 1);

        this.setState({ selectedICs: selectedICs });
        return;
      }
    }

    // add new entry
    if (event.target.checked === false) {
      return;
    }

    selectedICs.push(index);
    this.setState({ selectedICs: selectedICs });
  }

  runAction = action => {
    for (let index of this.state.selectedICs) {
      AppDispatcher.dispatch({
        type: 'ic/start-action',
        ic: this.state.ics[index],
        data: action.data,
        token: this.state.sessionToken,
      });
    }
  }

  static isICOutdated(component) {
    if (!component.stateUpdatedAt)
      return true;

    const fiveMinutes = 5 * 60 * 1000;

    return Date.now() - new Date(component.stateUpdatedAt) > fiveMinutes;
  }

  static stateLabelStyle(state, component){
    var style = [ 'label' ];

    if (InfrastructureComponents.isICOutdated(component) && state !== 'shutdown') {
      style.push('label-outdated');
    }

    switch (state) {
      case 'running':
        style.push('label-success');
        break;

      case 'paused':
        style.push('label-info');
        break;

      case 'idle':
        style.push('label-primary');
        break;

      case 'error':
        style.push('label-danger');
        break;

      case 'shutdown':
        style.push('label-warning');
        break;

      default:
        style.push('label-default');
    }

    return style.join(' ');
  }

  static stateUpdateModifier(updatedAt) {
    const date = new Date(updatedAt);

    return date.toLocaleString('de-DE');
  }

  render() {
    const buttonStyle = {
      marginLeft: '10px'
    };

    return (
      <div className='section'>
        <h1>Infrastructure Components</h1>

        <Table data={this.state.ics}>
          <TableColumn checkbox onChecked={(index, event) => this.onICChecked(index, event)} width='30' />
          <TableColumn title='Name' dataKeys={['properties.name', 'rawProperties.name']} />
          <TableColumn title='State' labelKey='state' tooltipKey='error' labelModifier={InfrastructureComponents.stateLabelModifier} labelStyle={InfrastructureComponents.stateLabelStyle} />
          <TableColumn title='Category' dataKeys={['properties.category', 'rawProperties.category']} />
          <TableColumn title='Type' dataKeys={['properties.type', 'rawProperties.type']} />
          <TableColumn title='Location' dataKeys={['properties.location', 'rawProperties.location']} />
          {/* <TableColumn title='Realm' dataKeys={['properties.realm', 'rawProperties.realm']} /> */}
          <TableColumn title='Host' dataKey='host' />
          <TableColumn title='Last Update' dataKey='stateUpdatedAt' modifier={InfrastructureComponents.stateUpdateModifier} />
          <TableColumn
            width='200'
            editButton
            exportButton
            deleteButton
            onEdit={index => this.setState({ editModal: true, modalIC: this.state.ics[index], modalIndex: index })}
            onExport={index => this.exportIC(index)}
            onDelete={index => this.setState({ deleteModal: true, modalIC: this.state.ics[index], modalIndex: index })}
          />
        </Table>

        <div style={{ float: 'left' }}>
          <ICAction
            runDisabled={this.state.selectedICs.length === 0}
            runAction={this.runAction}
            actions={[ { id: '0', title: 'Reset', data: { action: 'reset' } }, { id: '1', title: 'Shutdown', data: { action: 'shutdown' } } ]}/>
        </div>

        <div style={{ float: 'right' }}>
          <Button onClick={() => this.setState({ newModal: true })} style={buttonStyle}><Icon icon="plus" /> Infrastructure Component</Button>
          <Button onClick={() => this.setState({ importModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>
        </div>

        <div style={{ clear: 'both' }} />

        <NewICDialog show={this.state.newModal} onClose={data => this.closeNewModal(data)} />
        <EditICDialog show={this.state.editModal} onClose={data => this.closeEditModal(data)} ic={this.state.modalIC} />
        <ImportICDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} />

        <DeleteDialog title="infrastructure-component" name={_.get(this.state.modalIC, 'properties.name') || _.get(this.state.modalIC, 'rawProperties.name') || 'Unknown'} show={this.state.deleteModal} onClose={(e) => this.closeDeleteModal(e)} />
      </div>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(InfrastructureComponents));
