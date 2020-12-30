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
import {Button, Col, Row, FormGroup, FormLabel} from 'react-bootstrap';

import AppDispatcher from '../common/app-dispatcher';
import UsersStore from './users-store';

import Icon from '../common/icon';
import EditOwnUserDialog from './edit-own-user'
import NotificationsDataManager from "../common/data-managers/notifications-data-manager"

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
    updatedData.id = this.state.currentUser.id;
    let updatedUser = this.state.currentUser;
    let hasChanged = false;
    let pwChanged = false;

    if(data){
    if (data.username !== ''){
      hasChanged = true;
      updatedData.username = data.username;
      updatedUser.username = data.username
    }
    if (data.mail !== ''){
      hasChanged = true;
      updatedData.mail = data.mail;
      updatedUser.mail = data.mail;
    }
    if (data.password !== '' && data.oldPassword !== '' && data.password === data.confirmpassword ){
      pwChanged = true;
      updatedData.password = data.password;
      updatedData.oldPassword = data.oldPassword;
    } else if (data.password !== '' && data.password !== data.confirmpassword) {
      const USER_UPDATE_ERROR_NOTIFICATION = {
        title: 'Update Error ',
        message: 'New password not correctly confirmed',
        level: 'error'
      };
      NotificationsDataManager.addNotification(USER_UPDATE_ERROR_NOTIFICATION);
      return
    }

    if (hasChanged || pwChanged) {

      if(hasChanged){
        this.setState({currentUser: updatedUser})
      }

      AppDispatcher.dispatch({
        type: 'users/start-edit',
        data: updatedData,
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
    const iconStyle = {
      color: '#527984',
    }

    const buttonStyle = {
      margin: '10px',  
      borderColor: '#ffffff',
      backgroundColor: '#ffffff'
    }

    return (
      <div>
        <h1>Your User Account</h1>

        {this.state.currentUser !== undefined && this.state.currentUser !== null ?

          <form>

            <Row>
              <FormGroup as={Col} sm={2} controlId="details">
                <div style={{ alignItems: 'right' }}>Username:</div>
                <div style={{ alignItems: 'right' }}>E-mail:</div>
                <div style={{ alignItems: 'right' }}>Role:</div>
              </FormGroup>
              <FormGroup as={Col} sm={3} controlId="information" >
                <div> {this.state.currentUser.username}</div>
                <div>{this.state.currentUser.mail}</div>
                <div>{this.state.currentUser.role}</div>
                <Button size='lg' style={buttonStyle} onClick={() => this.setState({ editModal: true })}><Icon size='lg' style={iconStyle} icon='edit' /> </Button>
              </FormGroup>
            </Row>

            <EditOwnUserDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)}
              user={this.state.currentUser} />

          </form> : "Loading user data..."
        }
      </div>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(User));
