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
import { Button, Form, Row, Col } from 'react-bootstrap';

import AppDispatcher from '../common/app-dispatcher';
import UsersStore from './users-store';

import Icon from '../common/icon';
import EditOwnUserDialog from './edit-own-user'
import NotificationsDataManager from "../common/data-managers/notifications-data-manager"
import NotificationsFactory from "../common/data-managers/notifications-factory";

class User extends Component {
  static getStores() {
    return [ UsersStore ];
  }

  static calculateState(prevState, props) {
    prevState = prevState || {};

    let currentUserID = JSON.parse(localStorage.getItem("currentUser")).id;
    let currentUser = UsersStore.getState().find(user => user.id === parseInt(currentUserID, 10));

    return {
      currentUser,
      token: localStorage.getItem("token"),
      editModal: false,
    };
  }

  componentDidMount() {
    let currentUserID = JSON.parse(localStorage.getItem("currentUser")).id;

    AppDispatcher.dispatch({
      type: 'users/start-load',
      data: parseInt(currentUserID, 10),
      token: this.state.token
    });
  }

  closeEditModal(data) {
    this.setState({ editModal: false });

    let updatedData = {}
    let updatedUser = this.state.currentUser;
    let hasChanged = false;
    let pwChanged = false;

    updatedData.id = this.state.currentUser.id;

    if (data) {
      if (data.username !== this.state.currentUser.username) {
        hasChanged = true;
        updatedData.username = data.username;
        updatedUser.username = data.username
      }

      if (data.mail !== this.state.currentUser.mail) {
        hasChanged = true;
        updatedData.mail = data.mail;
        updatedUser.mail = data.mail;
      }

      if (data.password !== '' && data.oldPassword !== '' && data.password === data.confirmPassword ) {
        pwChanged = true;
        updatedData.password = data.password;
        updatedData.oldPassword = data.oldPassword;
      } else if (data.password !== '' && data.password !== data.confirmPassword) {
        NotificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR('New password not correctly confirmed'));
        return
      }

      if (hasChanged || pwChanged) {
        if (hasChanged){
          this.setState({ currentUser: updatedUser })
        }

        AppDispatcher.dispatch({
          type: 'users/start-edit',
          data: updatedData,
          token: this.state.token
        });
      } else {
        NotificationsDataManager.addNotification(NotificationsFactory.UPDATE_WARNING('No update requested, no input data'));
      }
    }
  }

  render() {
    let user = this.state.currentUser;

    return (
      <div>
        <h1>Account</h1>

        {user ?
          <>
            <Form>
              <Form.Group as={Row} controlId="username">
                <Form.Label column sm={2}>Username</Form.Label>
                <Col sm={10}>
                  <Form.Control plaintext readOnly defaultValue={user.username} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="mail">
                <Form.Label column sm={2}>E-mail</Form.Label>
                <Col sm={10}>
                  <Form.Control plaintext readOnly defaultValue={user.mail} type="email" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="role">
                <Form.Label column sm={2}>Role</Form.Label>
                <Col sm={10}>
                  <Form.Control plaintext readOnly defaultValue={user.role} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formBasicEmail">
                <Form.Label column sm={2}>Created at</Form.Label>
                <Col sm={10}>
                  <Form.Control plaintext readOnly defaultValue={user.createdAt} />
                </Col>
              </Form.Group>
              <Button variant="primary" onClick={() => this.setState({ editModal: true })}>
                <Icon icon='edit' /> Edit
              </Button>
            </Form>

            <EditOwnUserDialog
              show={this.state.editModal}
              onClose={(data) => this.closeEditModal(data)}
              user={user}
            />
          </>
          : <div/>
        }
      </div>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(User));
