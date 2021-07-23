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
import AppDispatcher from '../common/app-dispatcher';
import UsersStore from './users-store';
import LoginStore from './login-store';
import ScenarioStore from '../scenario/scenario-store';
import Icon from '../common/icon';
import IconButton from '../common/buttons/icon-button';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Table from '../common/table';
import TableColumn from '../common/table-column';
import NewUserDialog from './new-user';
import EditUserDialog from './edit-user';
import UsersToScenarioDialog from './users-to-scenario';
import DeleteDialog from '../common/dialogs/delete-dialog';

class Users extends Component {
  static getStores() {
    return [UsersStore, ScenarioStore, LoginStore];
  }

  static calculateState(prevState, props) {

    if (prevState == null) {
      prevState = {};
    }

    return {
      token: localStorage.getItem("token"),
      users: UsersStore.getState(),
      scenarios: ScenarioStore.getState(),
      usersToAdd: prevState.usersToAdd || new Map(),
      selectedScenarioID: prevState.selectedScenarioID || null,
      selectedScenario: prevState.selectedScenario || '',

      newModal: false,
      addUsersModal: false,
      editModal: false,
      deleteModal: false,
      modalData: {},
      currentUser: JSON.parse(localStorage.getItem("currentUser"))
    };
  }

  componentDidMount() {
    AppDispatcher.dispatch({
      type: 'scenarios/start-load',
      token: this.state.token
    });

    AppDispatcher.dispatch({
      type: 'users/start-load',
      token: this.state.token
    });

  }

  closeNewModal(data) {
    this.setState({ newModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'users/start-add',
        data: data,
        token: this.state.token
      });
    }
  }

  closeDeleteModal(confirmDelete) {
    this.setState({ deleteModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'users/start-remove',
      data: this.state.modalData,
      token: this.state.token
    });
  }

  closeEditModal(data) {
    this.setState({ editModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'users/start-edit',
        data: data,
        token: this.state.token,
        currentUser: this.state.currentUser,
      });
    }
  }

 onUserChecked(user) {
    let temp = this.state.usersToAdd;
    const found = temp.get(user.id);
    if (!found) {
      temp.set(user.id, user.username);
    } else {
      temp.delete(user.id)
    }
    this.setState({ usersToAdd: temp });
  }

  setScenario(ID) {

    let scenarioID = parseInt(ID, 10)
    let scenario = this.state.scenarios.find(s => s.id === scenarioID);
    this.setState({ selectedScenarioID: scenario.id, selectedScenario: scenario.name, addUsersModal: true })
  };

  closeAddUsersModal() {
    this.state.usersToAdd.forEach((value, key) => {
      AppDispatcher.dispatch({
        type: 'scenarios/add-user',
        data: this.state.selectedScenarioID,
        username: value,
        token: this.state.token
      });
    })

    this.setState({ addUsersModal: false, selectedScenarioID: null })
  }

  modifyActiveColumn(active) {
    return <Icon icon={active ? 'check' : 'times'} />
  }

  render() {
    const buttonStyle = {
      marginLeft: '10px',
    }

    const iconStyle = {
      height: '30px',
      width: '30px'
    }

    return <div>
      <h1>Users
          <span className='icon-button'>
          <IconButton
            childKey={0}
            tooltip='Add User'
            onClick={() => this.setState({ newModal: true })}
            icon='plus'
            buttonStyle={buttonStyle}
            iconStyle={iconStyle}
          />
        </span>
      </h1>

      <Table data={this.state.users}>
        {this.state.currentUser.role === "Admin" ?
          <TableColumn
            title='ID'
            dataKey='id'
          />
          : <></>
        }
        {this.state.currentUser.role === "Admin" ?
          <TableColumn
            title='Add'
            checkbox
            onChecked={(index, event) => this.onUserChecked(index, event)}
            checkboxKey='checked'
            width='30'
          />
          : <></>
        }
        <TableColumn
          title='Username'
          width='150'
          dataKey='username'
        />
        <TableColumn
          title='E-mail'
          dataKey='mail'
        />
        <TableColumn
          title='Role'
          dataKey='role'
        />
        <TableColumn
          title='Active'
          dataKey='active'
          modifier={(active) => this.modifyActiveColumn(active)}
        />
        <TableColumn
          width='200'
          align='right'
          editButton
          deleteButton
          onEdit={index => this.setState({
            editModal: true,
            modalData: this.state.users[index]
          })}
          onDelete={index => this.setState({
            deleteModal: true,
            modalData: this.state.users[index]
          })}
        />
      </Table>
      <span className='solid-button'>
        <DropdownButton
          title='Add to Scenario'
          onSelect={(id) => this.setScenario(id)}
        >
          {this.state.scenarios.map(scenario => (
            <Dropdown.Item key={scenario.id} eventKey={scenario.id}>{scenario.name}</Dropdown.Item>
          ))}
        </DropdownButton>
      </span>

      <UsersToScenarioDialog
        show={this.state.addUsersModal}
        users={this.state.usersToAdd}
        scenario={this.state.selectedScenario}
        onClose={() => this.closeAddUsersModal()}
      />
      <NewUserDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />
      <EditUserDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} user={this.state.modalData} />
      <DeleteDialog title="user" name={this.state.modalData.username} show={this.state.deleteModal} onClose={(e) => this.closeDeleteModal(e)} />
    </div>;
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Users));
