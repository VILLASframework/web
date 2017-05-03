/**
 * File: users.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 02.05.2017
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
import { Button, Modal, Glyphicon } from 'react-bootstrap';

import AppDispatcher from '../app-dispatcher';
import UserStore from '../stores/user-store';
import UsersStore from '../stores/users-store';

import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewUserDialog from '../components/dialog/new-user';
import EditUserDialog from '../components/dialog/edit-user';

class Users extends Component {
  static getStores() {
    return [ UserStore, UsersStore ];
  }

  static calculateState(prevState, props) {

    let tokenState = UserStore.getState().token;

    // If there is a token available and this method was called as a result of loading users
    if (!prevState && tokenState) {
      AppDispatcher.dispatch({
        type: 'users/start-load',
        token: tokenState
      });
    }

    return {
      token: tokenState,
      users: UsersStore.getState(),

      newModal: false,
      editModal: false,
      deleteModal: false,
      modalData: {}
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

  confirmDeleteModal() {
    this.setState({ deleteModal: false });

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
        token: this.state.token
      });
    }
  }

  render() {

    return (
      <div>
        <h1>Users</h1>

        <Table data={this.state.users}>
          <TableColumn title='Username' width='150' dataKey='username' />
          <TableColumn title='E-mail' dataKey='mail'  />
          <TableColumn title='Role' dataKey='role'  />
          <TableColumn width='70' editButton deleteButton onEdit={index => this.setState({ editModal: true, modalData: this.state.users[index] })} onDelete={index => this.setState({ deleteModal: true, modalData: this.state.users[index] })} />
        </Table>

        <Button onClick={() => this.setState({ newModal: true })}><Glyphicon glyph='plus' /> User</Button>

        <NewUserDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} />

        <EditUserDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} user={this.state.modalData} />

        <Modal show={this.state.deleteModal}>
          <Modal.Header>
            <Modal.Title>Delete user</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the user <strong>'{this.state.modalData.username}'</strong>?
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={() => this.setState({ deleteModal: false})}>Cancel</Button>
            <Button bsStyle='danger' onClick={() => this.confirmDeleteModal()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Container.create(Users);
