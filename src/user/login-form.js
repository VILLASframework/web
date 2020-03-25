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
import { Form, Button, FormGroup, FormControl, FormLabel, Col } from 'react-bootstrap';

import AppDispatcher from '../common/app-dispatcher';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      disableLogin: true
    }
  }

  login(event) {
    // prevent from submitting the form since we send an action
    event.preventDefault();

    // send login action
    AppDispatcher.dispatch({
      type: 'users/login',
      username: this.state.username,
      password: this.state.password
    });
  }

  handleChange(event) {
    let disableLogin = this.state.disableLogin;

    if (event.target.id === 'username') {
      disableLogin = this.state.password.length === 0 || event.target.value.length === 0;
    } else if (event.target.id === 'password') {
      disableLogin = this.state.username.length === 0 || event.target.value.length === 0;
    }

    this.setState({ [event.target.id]: event.target.value, disableLogin });
  }

  render() {
    return (
      <Form>
        <FormGroup controlId="username">
          <FormLabel column={true} sm={2}>Username</FormLabel>
          <Col sm={10}>
            <FormControl type="text" placeholder="Username" onChange={(e) => this.handleChange(e)} />
          </Col>
        </FormGroup>

        <FormGroup controlId="password">
          <FormLabel column={true} sm={2}>Password</FormLabel>
          <Col sm={10}>
            <FormControl type="password" placeholder="Password" onChange={(e) => this.handleChange(e)} />
          </Col>
        </FormGroup>

        {this.props.loginMessage &&
          <div style={{ marginBottom: '50px', color: 'red' }}>
            <Col sm={{span: 10, offset: 2}} style={{ paddingLeft: '5px' }}>
              <i>Error: </i>{this.props.loginMessage}
            </Col>
          </div>
        }

        <FormGroup>
          <Col sm={{span: 10, offset: 2}}>
            <Button type="submit" disabled={this.state.disableLogin} onClick={e => this.login(e)}>Login</Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default LoginForm;
