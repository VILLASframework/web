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
import {Button, Col, Row, FormGroup, FormLabel} from 'react-bootstrap';

import AppDispatcher from '../common/app-dispatcher';
import UserStore from './user-store';

import Icon from '../common/icon';
import EditUserDialog from './edit-user';

import DeleteDialog from '../common/dialogs/delete-dialog';
import ParametersEditor from "../common/parameters-editor";

class User extends Component {
  static getStores() {
    return [ UserStore ];
  }

  static calculateState(prevState, props) {
    prevState = prevState || {};

    const sessionToken = UserStore.getState().token;

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
      editModal: prevState.editModal || false,
      deleteModal: prevState.deleteModal || false,
      modalData: prevState.modalData || {}
    };
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
        token: this.state.token
      });
    }
  }

  getHumanRoleName(role_key) {
    const HUMAN_ROLE_NAMES = {Admin: 'Administrator', User: 'User', Guest: 'Guest'};

    return HUMAN_ROLE_NAMES.hasOwnProperty(role_key)? HUMAN_ROLE_NAMES[role_key] : '';
  }

  onModalKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      this.confirmDeleteModal();
    }
  };

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

        </form>

      </div>
    );
  }
}

{/*<Button onClick={() => this.setState({ editModal: true })}><Icon icon='edit' /> Edit</Button>*/}
{/*<Button onClick={() => this.setState({ deleteModal: true })}><Icon icon='trash' /> Delete</Button>*/}

{/*<EditUserDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} user={this.state.modalData} />*/}
{/*<DeleteDialog title="user" name={this.state.modalData.username} show={this.state.deleteModal} onClose={(e) => this.closeDeleteModal(e)} />*/}

{/*<Table data={this.state.user}>*/}
{/*  <TableColumn title='Username' width='150' dataKey='username' />*/}
{/*  <TableColumn title='ID' width='150' dataKey='id' />*/}
{/*  <TableColumn title='E-mail' dataKey='mail'  />*/}
{/*  <TableColumn title='Role' dataKey='role'   modifier={(role) => this.getHumanRoleName(role)} />*/}
{/*  <TableColumn title='Active' dataKey='active'/>*/}
{/*</Table>*/}


let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(User));
