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

import React from 'react';
import { Container } from 'flux/utils';
import { Form, Row, Col } from 'react-bootstrap';
import AppDispatcher from '../common/app-dispatcher';
import EditOwnUserDialog from './edit-own-user'
import IconButton from "../common/buttons/icon-button";
import LoginStore from './login-store'

class User extends React.Component {
  constructor() {
    super();

    this.state = {
      token: LoginStore.getState().token,
      editModal: false,
    }
  }

  static getStores() {
    return [ LoginStore ];
  }

  static calculateState(prevState, props) {
    return {
      currentUser: LoginStore.getState().currentUser
    }
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

  render() {
    let user = this.state.currentUser;

    const buttonStyle = {
      marginLeft: '10px',
    }

    const iconStyle = {
      height: '30px',
      width: '30px'
    }

    return (
      <div>
        <h1>Account
          <span className='icon-button'>

            <IconButton
              childKey={0}
              tooltip='Edit Account'
              onClick={() => this.setState({ editModal: true })}
              icon='edit'
              buttonStyle={buttonStyle}
              iconStyle={iconStyle}
            />
          </span>
        </h1>

        {user ?
          <>
            <Form>
              <Form.Group as={Row} controlId="username">
                <Form.Label column sm={2}>Username</Form.Label>
                <Col sm={10}>
                  <Form.Control plaintext readOnly value={user.username} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="mail">
                <Form.Label column sm={2}>E-mail</Form.Label>
                <Col sm={10}>
                  <Form.Control plaintext readOnly value={user.mail} type="email" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="role">
                <Form.Label column sm={2}>Role</Form.Label>
                <Col sm={10}>
                  <Form.Control plaintext readOnly value={user.role} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formBasicEmail">
                <Form.Label column sm={2}>Created at</Form.Label>
                <Col sm={10}>
                  <Form.Control plaintext readOnly value={user.createdAt} />
                </Col>
              </Form.Group>

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
