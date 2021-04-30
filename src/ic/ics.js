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
import { Badge } from 'react-bootstrap';
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

import ICAction from './ic-action';
import DeleteDialog from '../common/dialogs/delete-dialog';
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../common/data-managers/notifications-factory";
import IconButton from '../common/icon-button';

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

  static calculateState(prevState, props) {
    if (prevState == null) {
      prevState = {};
    }

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

    // collect number of external ICs
    let externalICs = ics.filter(ic => ic.managedexternally === true)
    let numberOfExternalICs = externalICs.length;

    // collect all IC categories
    let managers = ics.filter(ic => ic.category === "manager")
    let gateways = ics.filter(ic => ic.category === "gateway")
    let simulators = ics.filter(ic => ic.category === "simulator")
    let services = ics.filter(ic => ic.category === "service")
    let equipment = ics.filter(ic => ic.category === "equipment")

    return {
      sessionToken: localStorage.getItem("token"),
      ics: ics,
      managers: managers,
      gateways: gateways,
      simulators: simulators,
      services: services,
      equipment: equipment,
      numberOfExternalICs,
      modalIC: {},
      deleteModal: false,
      icModal: false,
      selectedICs: prevState.selectedICs || [],
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
            url: ic.apiurl,
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
      if (!data.managedexternally) {
        AppDispatcher.dispatch({
          type: 'ics/start-add',
          data,
          token: this.state.sessionToken,
        });
      } else {
        // externally managed IC: dispatch create action to selected manager
        let newAction = {};

        newAction["action"] = "create";
        newAction["parameters"] = data.parameters;
        newAction["when"] = new Date()

        // find the manager IC
        let managerIC = this.state.ics.find(ic => ic.uuid === data.manager)
        if (managerIC === null || managerIC === undefined){
          NotificationsDataManager.addNotification(NotificationsFactory.ADD_ERROR("Could not find manager IC with UUID " + data.manager));
          return;
        }

        AppDispatcher.dispatch({
          type: 'ics/start-action',
          icid: managerIC.id,
          action: newAction,
          result: null,
          token: this.state.sessionToken
        });
      }
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

  onICChecked(ic, event) {
    let index = this.state.ics.indexOf(ic);
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
         *  'error':        ['resetting', 'error'],
         *  'idle':         ['resetting', 'error', 'idle', 'starting', 'shuttingdown'],
         *  'starting':     ['resetting', 'error', 'running'],
         *  'running':      ['resetting', 'error', 'pausing', 'stopping'],
         *  'pausing':      ['resetting', 'error', 'paused'],
         *  'paused':       ['resetting', 'error', 'resuming', 'stopping'],
         *  'resuming':     ['resetting', 'error', 'running'],
         *  'stopping':     ['resetting', 'error', 'idle'],
         *  'resetting':    ['resetting', 'error', 'idle'],
         *  'shuttingdown': ['shutdown', 'error'],
         *  'shutdown':     ['starting', 'error']
         */
    }

    return style.join(' ')
  }

  stateUpdateModifier(updatedAt, component) {
    let dateFormat = 'ddd, DD MMM YYYY HH:mm:ss ZZ';
    let dateTime = moment(updatedAt, dateFormat);
    return dateTime.fromNow()
  }

  modifyUptimeColumn(uptime, component){
    if(uptime >= 0){
      let momentDurationFormatSetup = require("moment-duration-format");
      momentDurationFormatSetup(moment)

      let timeString = moment.duration(uptime, "seconds").humanize();
      return <span>{timeString}</span>
    }
    else{
      return <Badge variant="secondary">Unknown</Badge>
    }
  }

  isLocalIC(index, ics){
    let ic = ics[index]
    return !ic.managedexternally
  }

  getICCategoryTable(ics, editable, title){
    if (ics && ics.length > 0) {
      return (<div>
        <h2>{title}</h2>
        <Table data={ics}>
          <TableColumn
            checkbox
            checkboxDisabled={(index) => this.isLocalIC(index, ics) === true}
            onChecked={(ic, event) => this.onICChecked(ic, event)}
            width='30'
          />
          {this.state.currentUser.role === "Admin" ?
            <TableColumn
              title='ID'
              dataKey='id'
            />
            : <></>
          }
          <TableColumn
            title='Name'
            dataKeys={['name']}
            link='/infrastructure/'
            linkKey='id'
          />
          <TableColumn
            title='State'
            labelKey='state'
            tooltipKey='error'
            labelStyle={(state, component) => this.stateLabelStyle(state, component)}
          />
          <TableColumn
            title='Type'
            dataKeys={['type']}
          />
          <TableColumn
            title='Uptime'
            dataKey='uptime'
            modifier={(uptime, component) => this.modifyUptimeColumn(uptime, component)}
          />
          <TableColumn
            title='Last Update'
            dataKey='stateUpdateAt'
            modifier={(stateUpdateAt, component) => this.stateUpdateModifier(stateUpdateAt, component)}
          />

          {this.state.currentUser.role === "Admin" ?
            <TableColumn
              width='150'
              align='right'
              editButton
              showEditButton ={(index) => this.isLocalIC(index, ics)}
              exportButton
              deleteButton
              showDeleteButton = {(index) => this.isLocalIC(index, ics)}
              onEdit={index => this.setState({editModal: true, modalIC: ics[index], modalIndex: index})}
              onExport={index => this.exportIC(index)}
              onDelete={index => this.setState({deleteModal: true, modalIC: ics[index], modalIndex: index})}
            />
            :
            <TableColumn
              width='50'
              exportButton
              onExport={index => this.exportIC(index)}
            />
          }
        </Table>
      </div>);
    } else {
      return <div/>
    }

  }

  render() {


    let managerTable = this.getICCategoryTable(this.state.managers, false, "IC Managers")
    let simulatorTable = this.getICCategoryTable(this.state.simulators, true, "Simulators")
    let gatewayTable = this.getICCategoryTable(this.state.gateways, true, "Gateways")
    let serviceTable = this.getICCategoryTable(this.state.services, true, "Services")
    let equipmentTable = this.getICCategoryTable(this.state.equipment, true, "Equipment")

    return (
      <div className='section'>
        <h1>Infrastructure
          {this.state.currentUser.role === "Admin" ?
            <span className='icon-button'>
              <IconButton
                childKey={1}
                tooltip='Add Infrastructure Component'
                onClick={() => this.setState({newModal: true})}
                icon='plus'
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
              />
              <IconButton
                childKey={1}
                tooltip='Import Infrastructure Component'
                onClick={() => this.setState({importModal: true})}
                icon='upload'
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
              />
            </span>
            : <span/>
          }
        </h1>

        {managerTable}
        {simulatorTable}
        {gatewayTable}
        {serviceTable}
        {equipmentTable}

        {this.state.currentUser.role === "Admin" && this.state.numberOfExternalICs > 0 ?
          <div style={{float: 'left'}}>
            <ICAction
              ics={this.state.ics}
              selectedICs={this.state.selectedICs}
              token={this.state.sessionToken}
              actions={[
                {id: '0', title: 'Reset', data: {action: 'reset'}},
                {id: '1', title: 'Shutdown', data: {action: 'shutdown'}},
                {id: '2', title: 'Delete', data: {action: 'delete'}},
                {id: '3', title: 'Recreate', data: {action: 'create'}},
              ]}
            />
          </div>
          : <div/>
        }

        <div style={{ clear: 'both' }} />

        <NewICDialog show={this.state.newModal} onClose={data => this.closeNewModal(data)} managers={this.state.managers} />
        <EditICDialog show={this.state.editModal} onClose={data => this.closeEditModal(data)} ic={this.state.modalIC} />
        <ImportICDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} />
        <DeleteDialog title="infrastructure-component" name={this.state.modalIC.name || 'Unknown'} show={this.state.deleteModal} onClose={(e) => this.closeDeleteModal(e)} />
      </div>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(InfrastructureComponents));
