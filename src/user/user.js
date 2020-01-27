/**
 * File: user.js
 * Author: Sonja Happ
 * Date: 18.09.2019
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
import {Button, Col, Row} from 'react-bootstrap';

import AppDispatcher from '../common/app-dispatcher';
import LoginStore from './login-store';
import UsersStore from './users-store';


import Icon from '../common/icon';
import EditOwnUserDialog from './edit-own-user'
import NotificationsDataManager from "../common/data-managers/notifications-data-manager"


class User extends Component {
  static getStores() {
    return [ LoginStore, UsersStore ];
  }

  static calculateState(prevState, props) {
    prevState = prevState || {};

    let user = LoginStore.getState().currentUser;

    return {
      currentUser: user,
      token: LoginStore.getState().token,
      editModal: false,
    };
  }

  closeEditModal(data) {

    this.setState({ editModal: false });
    //this.setState({currentUser: data});
    let updatedData = {};

    if(data){
    if (data.username !== ''){
      updatedData["id"] = data.id;
      updatedData["username"] = data.username;
    }
    if (data.mail !== ''){
      updatedData["id"] = data.id;
      updatedData["mail"] = data.mail;
    }
    if (data.password !== '' && data.oldPassword !== '' && data.password === data.confirmpassword ){
      updatedData["id"] = data.id;
      updatedData["password"] = data.password;
      updatedData["oldPassword"] = data.oldPassword;
    } else if (data.password !== '' && data.password !== data.confirmpassword) {
      const USER_UPDATE_ERROR_NOTIFICATION = {
        title: 'Update Error ',
        message: 'New password not correctly confirmed',
        level: 'error'
      };
      NotificationsDataManager.addNotification(USER_UPDATE_ERROR_NOTIFICATION);
      return
    }

    if (updatedData !== {}) {
      let requestData = {};
      requestData["user"] = updatedData;

      AppDispatcher.dispatch({
        type: 'users/start-edit-own-user',
        data: requestData,
        token: this.state.token
      });
    } else {
      const USER_UPDATE_WARNING_NOTIFICATION = {
        title: 'Update Warning ',
        message: 'No update requested, no input data',
        level: 'warning'
      };
      NotificationsDataManager.addNotification(USER_UPDATE_WARNING_NOTIFICATION);
    }
  }
  }


  getHumanRoleName(role_key) {
    const HUMAN_ROLE_NAMES = {Admin: 'Administrator', User: 'User', Guest: 'Guest'};

    return HUMAN_ROLE_NAMES.hasOwnProperty(role_key)? HUMAN_ROLE_NAMES[role_key] : '';
  }


  render() {

    return (
      <div>
        <h1>Your User Account</h1>

        <form>
          <Row>
            <Col xs={3}>Username: </Col>
            <Col xs={3}> {this.state.currentUser.username} </Col>
          </Row>


          <Row as={Col} >
            <Col xs={3}>E-mail: </Col>
            <Col xs={3}> {this.state.currentUser.mail} </Col>
          </Row>

          <Row as={Col} >
            <Col xs={3}>Role: </Col>
            <Col xs={3}> {this.state.currentUser.role} </Col>
          </Row>


          <Button onClick={() => this.setState({ editModal: true })}><Icon icon='edit' /> Edit</Button>

          <EditOwnUserDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} user={this.state.currentUser} />

        </form>

      </div>
    );
  }
}




let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(User));
