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
import { Button, Badge } from 'react-bootstrap';
import FileSaver from 'file-saver';
import _ from 'lodash';
import moment from 'moment'

import AppDispatcher from '../common/app-dispatcher';
import InfrastructureComponentStore from './ic-store';

import Icon from '../common/icon';
import Table from '../common/table';
import TableColumn from '../common/table-column';
import NewICDialog from './new-ic';
import EditICDialog from './edit-ic';
import ImportICDialog from './import-ic';
import ICDialog from './ic-dialog';

import ICAction from './ic-action';
import DeleteDialog from '../common/dialogs/delete-dialog';

class InfrastructureComponents extends Component {
  static getStores() {
    return [ InfrastructureComponentStore];
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
      sessionToken: localStorage.getItem("token"),
      ics: ics,
      modalIC: {},
      deleteModal: false,
      icModal: false,
      selectedICs: [],
      currentUser: JSON.parse(localStorage.getItem("currentUser"))
    };
  }

  componentDidMount() {
    AppDispatcher.dispatch({
      type: 'ics/start-load',
      token: this.state.sessionToken,
    });

   // Start timer for periodic refresh
    this.timer = window.setInterval(() => this.refresh(), 10000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  refresh() {

    if (this.state.editModal || this.state.deleteModal || this.state.icModal){
      // do nothing since a dialog is open at the moment
    }
    else {
      AppDispatcher.dispatch({
        type: 'ics/start-load',
        token: this.state.sessionToken,
      });

      // get status of VILLASnode and VILLASrelay ICs
      this.state.ics.forEach(ic => {
        if ((ic.type === "villas-node" || ic.type === "villas-relay")
          && ic.apiurl !== '' && ic.apiurl !== undefined && ic.apiurl !== null && !ic.managedexternally) {
          AppDispatcher.dispatch({
            type: 'ics/get-status',
            url: ic.apiurl + "/status",
            token: this.state.sessionToken,
            ic: ic
          });
        }
      })

    }
  }


  closeNewModal(data) {
    this.setState({ newModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'ics/start-add',
        data,
        token: this.state.sessionToken,
      });
    }
  }

  closeEditModal(data) {
    this.setState({ editModal : false });

    if (data) {
      //let ic = this.state.ics[this.state.modalIndex];
      //ic = data;
      //this.setState({ ic: ic });

      AppDispatcher.dispatch({
        type: 'ics/start-edit',
        data: data,
        token: this.state.sessionToken,
      });
    }
  }

  closeICModal(data){
    this.setState({ icModal : false });
  }

  closeDeleteModal(confirmDelete){
    this.setState({ deleteModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'ics/start-remove',
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
        type: 'ics/start-add',
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

  runAction(action) {
    for (let index of this.state.selectedICs) {
      AppDispatcher.dispatch({
        type: 'ics/start-action',
        ic: this.state.ics[index],
        data: action.data,
        token: this.state.sessionToken,
      });
    }
  }

  static isICOutdated(component) {
    if (!component.stateUpdateAt)
      return true;

    const fiveMinutes = 5 * 60 * 1000;

    return Date.now() - new Date(component.stateUpdateAt) > fiveMinutes;
  }

  stateLabelStyle(state, component){

    var style = [ 'badge' ];

    if (InfrastructureComponents.isICOutdated(component) && state !== 'shutdown') {
      style.push('badge-outdated');
    }

    switch (state) {
      case 'error':
        style.push('badge-danger');
        break;
      case 'idle':
        style.push('badge-primary');
        break;
      case 'starting':
        style.push('badge-info');
        break;
      case 'running':
        style.push('badge-success');
        break;
      case 'pausing':
        style.push('badge-info');
        break;
      case 'paused':
        style.push('badge-info');
        break;
      case 'resuming':
        style.push('badge-warning');
        break;
      case 'stopping':
        style.push('badge-warning');
        break;
      case 'resetting':
        style.push('badge-warning');
        break;
      case 'shuttingdown':
        style.push('badge-warning');
        break;
      case 'shutdown':
        style.push('badge-warning');
        break;

      default:
        style.push('badge-default');


        /* Possible states of ICs
        *   'error':        ['resetting', 'error'],
            'idle':         ['resetting', 'error', 'idle', 'starting', 'shuttingdown'],
            'starting':     ['resetting', 'error', 'running'],
            'running':      ['resetting', 'error', 'pausing', 'stopping'],
            'pausing':      ['resetting', 'error', 'paused'],
            'paused':       ['resetting', 'error', 'resuming', 'stopping'],
            'resuming':     ['resetting', 'error', 'running'],
            'stopping':     ['resetting', 'error', 'idle'],
            'resetting':    ['resetting', 'error', 'idle'],
            'shuttingdown': ['shutdown', 'error'],
            'shutdown':     ['starting', 'error']
        * */
    }

    return style.join(' ')
  }

  stateUpdateModifier(updatedAt) {
    let dateFormat = 'ddd, DD MMM YYYY HH:mm:ss ZZ';
    let dateTime = moment(updatedAt, dateFormat);
    return dateTime.fromNow()
  }

  modifyManagedExternallyColumn(managedExternally){

    if(managedExternally){
      return <Icon icon='check' />
    } else {
      return ""
    }

  }

  modifyUptimeColumn(uptime){
    if(uptime >= 0){
      return <span>{uptime + "s"}</span>
    }
    else{
      return <Badge variant="secondary">Unknown</Badge>
    }
  }

  modifyNameColumn(name){
    let ic = this.state.ics.find(ic => ic.name === name);

    if(ic.type === "villas-node" || ic.type === "villas-relay" || ic.managedexternally){
      return <Button variant="link" onClick={() => this.openICStatus(ic)}>{name}</Button>    }
    else{
      return <span>{name}</span>
    }
  }

  openICStatus(ic){

    let index = this.state.ics.indexOf(ic);

    this.setState({ icModal: true, modalIC: ic, modalIndex: index })
  }

  sendControlCommand(command,ic){

    if(command === "restart"){
      AppDispatcher.dispatch({
        type: 'ics/restart',
        url: ic.apiurl + "/restart",
        token: this.state.sessionToken,
      });
    }else if(command === "shutdown"){
      AppDispatcher.dispatch({
        type: 'ics/shutdown',
        url: ic.apiurl + "/shutdown",
        token: this.state.sessionToken,
      });
    }

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
          <TableColumn title='Name' dataKeys={['name', 'rawProperties.name']} modifier={(name) => this.modifyNameColumn(name)}/>
          <TableColumn title='State' labelKey='state' tooltipKey='error' labelStyle={(state, component) => this.stateLabelStyle(state, component)} />
          <TableColumn title='Category' dataKeys={['category', 'rawProperties.category']} />
          <TableColumn title='Type' dataKeys={['type', 'rawProperties.type']} />
          <TableColumn title='Managed externally' dataKey='managedexternally' modifier={(managedexternally) => this.modifyManagedExternallyColumn(managedexternally)} width='105' />
          <TableColumn title='Uptime' dataKey='uptime' modifier={(uptime) => this.modifyUptimeColumn(uptime)}/>
          <TableColumn title='Location' dataKey='location' />
          {/* <TableColumn title='Realm' dataKeys={['properties.realm', 'rawProperties.realm']} /> */}
          <TableColumn title='WebSocket URL' dataKey='websocketurl' />
          <TableColumn title='API URL' dataKey='apiurl' />
          <TableColumn title='Last Update' dataKey='stateUpdateAt' modifier={(stateUpdateAt) => this.stateUpdateModifier(stateUpdateAt)} />
          {this.state.currentUser.role === "Admin" ?
          <TableColumn
            width='200'
            editButton
            exportButton
            deleteButton
            onEdit={index => this.setState({ editModal: true, modalIC: this.state.ics[index], modalIndex: index })}
            onExport={index => this.exportIC(index)}
            onDelete={index => this.setState({ deleteModal: true, modalIC: this.state.ics[index], modalIndex: index })}
          />
          :
          <TableColumn
            width='100'
            exportButton
            onExport={index => this.exportIC(index)}
          />
          }
        </Table>
        {this.state.currentUser.role === "Admin" ?
          <div style={{ float: 'left' }}>
            <ICAction
              runDisabled={this.state.selectedICs.length === 0}
              runAction={action => this.runAction(action)}
              actions={[
                { id: '-1', title: 'Select command', data: { action: 'none' } },
                { id: '0', title: 'Reset', data: { action: 'reset' } },
                { id: '1', title: 'Shutdown', data: { action: 'shutdown' } },
                ]}
            />
          </div>
          :
          <div> </div>
        }

        {this.state.currentUser.role === "Admin" ?
          <div style={{ float: 'right' }}>
            <Button onClick={() => this.setState({ newModal: true })} style={buttonStyle}><Icon icon="plus" /> Infrastructure Component</Button>
            <Button onClick={() => this.setState({ importModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>
          </div>
          :
          <div> </div>
        }

        <div style={{ clear: 'both' }} />

        <NewICDialog show={this.state.newModal} onClose={data => this.closeNewModal(data)} />
        <EditICDialog show={this.state.editModal} onClose={data => this.closeEditModal(data)} ic={this.state.modalIC} />
        <ImportICDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} />
        <ICDialog
          show={this.state.icModal}
          onClose={data => this.closeICModal(data)}
          ic={this.state.modalIC}
          token={this.state.sessionToken}
          userRole={this.state.currentUser.role}
          sendControlCommand={(command, ic) => this.sendControlCommand(command, ic)}/>

        <DeleteDialog title="infrastructure-component" name={this.state.modalIC.name || 'Unknown'} show={this.state.deleteModal} onClose={(e) => this.closeDeleteModal(e)} />
      </div>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(InfrastructureComponents));
