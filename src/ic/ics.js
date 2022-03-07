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

import {Table, ButtonColumn, CheckboxColumn, DataColumn, LabelColumn, LinkColumn } from '../common/table';


import NewICDialog from './new-ic';
import EditICDialog from './edit-ic';
import ImportICDialog from './import-ic';

import ICActionBoard from './ic-action-board';
import DeleteDialog from '../common/dialogs/delete-dialog';
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../common/data-managers/notifications-factory";
import IconButton from '../common/buttons/icon-button';
import IconToggleButton from '../common/buttons/icon-toggle-button';

class InfrastructureComponents extends Component {
  static getStores() {
    return [InfrastructureComponentStore];
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
      modalIC: prevState.modalIC || {},
      deleteModal: false,
      icModal: false,
      selectedICs: prevState.selectedICs || [],
      currentUser: JSON.parse(localStorage.getItem("currentUser")),
      showGeneric: prevState.showGeneric || false,
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
    if (this.state.editModal || this.state.deleteModal || this.state.icModal) {
      // do nothing since a dialog is open at the moment
      return
    }
    else {
      AppDispatcher.dispatch({
        type: 'ics/start-load',
        token: this.state.sessionToken,
      });

    }
  }

  closeNewModal(data) {
    this.setState({ newModal: false });

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
        if (managerIC === null || managerIC === undefined) {
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
    this.setState({ editModal: false, modalIC: {} });

    if (data) {
      AppDispatcher.dispatch({
        type: 'ics/start-edit',
        data: data,
        token: this.state.sessionToken,
      });
    }
  }


  closeDeleteModal(confirmDelete) {
    this.setState({ deleteModal: false});

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

  static stateLabelStyle(state, component) {
    let style = [];

    switch (state) {
      case 'error':
        style[0] = 'danger';
        break;
      case 'idle':
        style[0] = 'primary';
        break;
      case 'starting':
        style[0] = 'info';
        break;
      case 'running':
        style[0] = 'success';
        break;
      case 'pausing':
        style[0] = 'info';
        break;
      case 'paused':
        style[0] = 'info';
        break;
      case 'resuming':
        style[0] = 'warning';
        break;
      case 'stopping':
        style[0] = 'warning';
        break;
      case 'resetting':
        style[0] = 'warning';
        break;
      case 'shuttingdown':
        style[0] = 'warning';
        break;
      case 'shutdown':
        style[0] = 'warning';
        break;

      default:
        style[0] = 'secondary';

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

    if (InfrastructureComponents.isICOutdated(component) && state !== 'shutdown') {
      style[1] = 'badge-outdated';
    }
    else {
      style[1] = '';
    }

    return style
  }

  static stateUpdateModifier(updatedAt, component) {
    let dateFormat = 'ddd, DD MMM YYYY HH:mm:ss ZZ';
    let dateTime = moment(updatedAt, dateFormat);
    return dateTime.fromNow()
  }

  static modifyUptimeColumn(uptime, component) {
    if (uptime >= 0) {
      let momentDurationFormatSetup = require("moment-duration-format");
      momentDurationFormatSetup(moment)

      let timeString = moment.duration(uptime, "seconds").humanize();
      return <span>{timeString}</span>
    }
    else {
      return <Badge bg="secondary">unknown</Badge>
    }
  }

  static isLocalIC(index, ics) {
    let ic = ics[index]
    return !ic.managedexternally
  }

  getICCategoryTable(ics, title, isManager = false) {
    if (ics && (ics.length > 0 || isManager)) {
      return (<div>
        <h2>
          {title}
          { isManager ?
          <span className='icon-button'>
          <IconToggleButton
            childKey={0}
            index={1}
            onChange={() => this.setState(prevState => ({showGeneric: !prevState.showGeneric}))}
            checked={this.state.showGeneric}
            checkedIcon='eye'
            uncheckedIcon='eye-slash'
            tooltipChecked='click to hide generic managers'
            tooltipUnchecked='click to show generic managers'
          />
        </span>:<></>
          }
        </h2>
        <Table data={ics}>
          <CheckboxColumn
            checkboxDisabled={(index) => InfrastructureComponents.isLocalIC(index, ics) === true}
            onChecked={(ic, event) => this.onICChecked(ic, event)}
            width='30'
          />
          {this.state.currentUser.role === "Admin" ?
            <DataColumn
              title='ID'
              dataKey='id'
            />
            : <></>
          }
          <LinkColumn
            title='Name'
            dataKeys={['name']}
            link='/infrastructure/'
            linkKey='id'
          />
          <LabelColumn
            title='State'
            labelKey='state'
            labelStyle={(state, component) => InfrastructureComponents.stateLabelStyle(state, component)}
          />
          <DataColumn
            title='Type'
            dataKeys={['type']}
          />
          <DataColumn
            title='Uptime'
            dataKey='uptime'
            modifier={(uptime, component) => InfrastructureComponents.modifyUptimeColumn(uptime, component)}
          />
          <DataColumn
            title='Last Update'
            dataKey='stateUpdateAt'
            modifier={(stateUpdateAt, component) => InfrastructureComponents.stateUpdateModifier(stateUpdateAt, component)}
          />

          {this.state.currentUser.role === "Admin" ?
            <ButtonColumn
              width='150'
              align='right'
              editButton
              showEditButton ={(index) => InfrastructureComponents.isLocalIC(index, ics)}
              exportButton
              deleteButton
              showDeleteButton = {null}
              onEdit={index => this.setState({editModal: true, modalIC: ics[index], modalIndex: index})}
              onExport={index => this.exportIC(index)}
              onDelete={index => this.setState({deleteModal: true, modalIC: ics[index], modalIndex: index})}
            />
            :
            <ButtonColumn
              width='50'
              exportButton
              onExport={index => this.exportIC(index)}
            />
          }
        </Table>
      </div >);
    } else {
      return <div />
    }

  }

  render() {
    const buttonStyle = {
      marginLeft: '10px',
    }

    const iconStyle = {
      height: '30px',
      width: '30px'
    }

    let managerTable = this.getICCategoryTable(this.state.managers, "IC Managers ", true)
    // filter out generic managers
    if (!this.state.showGeneric) {
      let managers = this.state.managers.filter(ic => ic.type !== "generic")
      managerTable = this.getICCategoryTable(managers, "IC Managers ", true)
    }

    let simulatorTable = this.getICCategoryTable(this.state.simulators, "Simulators")
    let gatewayTable = this.getICCategoryTable(this.state.gateways, "Gateways")
    let serviceTable = this.getICCategoryTable(this.state.services, "Services")
    let equipmentTable = this.getICCategoryTable(this.state.equipment, "Equipment")

    return (
      <div>
      <div className='section'>
        <h1>Infrastructure
          {this.state.currentUser.role === "Admin" ?
            <span className='icon-button'>
              <IconButton
                childKey={1}
                tooltip='Add Infrastructure Component'
                onClick={() => this.setState({ newModal: true })}
                icon='plus'
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
              />
              <IconButton
                childKey={1}
                tooltip='Import Infrastructure Component'
                onClick={() => this.setState({ importModal: true })}
                icon='upload'
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
              />
            </span>
            : <span />
          }
        </h1>

        {managerTable}
        {simulatorTable}
        {gatewayTable}
        {serviceTable}
        {equipmentTable}
        </div>

        {this.state.currentUser.role === "Admin" && this.state.numberOfExternalICs > 0 ?
          <div>
            <ICActionBoard
              ics={this.state.ics}
              selectedICs={this.state.selectedICs}
              token={this.state.sessionToken}
              enableResultCheck={false}
              doStart={false}
              doPauseResume={false}
              doStop={false}
              doReset={true}
              doShutdown={true}
              doDelete={true}
              doRecreate={true}
            />
          </div>
          : <div />
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
export const stateLabelStyle = InfrastructureComponents.stateLabelStyle;
