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

import Icon from '../common/icon';
import IconButton from '../common/icon-button';
import Table from '../common/table';
import TableColumn from '../common/table-column';
import NewUserDialog from './new-user';
import EditUserDialog from './edit-user';

import DeleteDialog from '../common/dialogs/delete-dialog';
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../common/data-managers/notifications-factory";

class Users extends Component {
  static getStores() {
    return [ UsersStore ];
  }

  static calculateState(prevState, props) {
    let token = localStorage.getItem("token");

    // If there is a token available and this method was called as a result of loading users
    if (!prevState && token) {
      AppDispatcher.dispatch({
        type: 'users/start-load',
        token: token
      });
    }

    return {
      token: token,
      users: UsersStore.getState(),

      newModal: false,
      editModal: false,
      deleteModal: false,
      modalData: {},
      currentUser: JSON.parse(localStorage.getItem("currentUser"))
    };
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
      if (data.password === data.confirmPassword) {
        AppDispatcher.dispatch({
          type: 'users/start-edit',
          data: data,
          token: this.state.token
        });
      } else {
        NotificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR("New password not correctly confirmed"))
      }
    }
  }

  onModalKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      this.confirmDeleteModal();
    }
  };

  modifyActiveColumn(active) {
    return <Icon icon={active ? 'check' : 'times'} />
  }

  render() {
    return <div>
        <h1>Users
          <span className='icon-button'>
            <IconButton
              key={0}
              tooltip='Add User'
              onClick={() => this.setState({ newModal: true })}
              icon='plus'
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

        <NewUserDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />
        <EditUserDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} user={this.state.modalData} />
        <DeleteDialog title="user" name={this.state.modalData.username} show={this.state.deleteModal} onClose={(e) => this.closeDeleteModal(e)} />
      </div>;
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Users));
