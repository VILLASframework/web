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
import UserStore from './user-store';
import UsersStore from './users-store';


import Icon from '../common/icon';
import EditOwnUserDialog from './edit-own-user'


class User extends Component {
  static getStores() {
    return [ UserStore, UsersStore ];
  }

  static calculateState(prevState, props) {
    //prevState = prevState || {};

    let sessionToken = UserStore.getState().token;
    let user = UserStore.getState().currentUser;
  

    if(user === null) {
      AppDispatcher.dispatch({
        type: 'users/start-load',
        data: UserStore.getState().userid,
        token: sessionToken
      });

      user = {};
    }

    console.log("extracted user 2: " + user.username);

    return {
      user,

      token: sessionToken,
      newModal: false,
      editModal: false,
      update: false,
      modalData: {}
    };
  }



  closeEditModal(data) {
    this.setState({ editModal: false });
    console.log(data);

    if (data) {
      if(data.password === data.confirmpassword){
      
      AppDispatcher.dispatch({
        type: 'users/start-own-edit',
        data: data,
        token: this.state.token
      });
    }

    else{
      console.log("error: not the same password");
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
            <Col xs={3}> {this.state.user.username} </Col>
          </Row>


          <Row as={Col} >
            <Col xs={3}>E-mail: </Col>
            <Col xs={3}> {this.state.user.mail} </Col>
          </Row>

          <Row as={Col} >
            <Col xs={3}>Role: </Col>
            <Col xs={3}> {this.state.user.role} </Col>
          </Row>
          <Button onClick={() => this.setState({ editModal: true })}><Icon icon='edit' /> Edit</Button>

          <EditOwnUserDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} user={this.state.modalData} />

        </form>

      </div>
    );
  }
}




let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(User));
