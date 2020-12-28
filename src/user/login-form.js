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
import RecoverPassword from './recover-password'
import AppDispatcher from '../common/app-dispatcher';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      forgottenPassword: false,
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

  openRecoverPassword(){
    this.setState({forgottenPassword: true});
  }

  closeRecoverPassword(){
    this.setState({forgottenPassword: false});
  }

  render() {
    return (
      <Form>
        <FormGroup controlId="username">
          <FormLabel column={true}>Username</FormLabel>
          <Col>
            <FormControl type="text" placeholder="Username" onChange={(e) => this.handleChange(e)} />
          </Col>
        </FormGroup>

        <FormGroup controlId="password">
          <FormLabel column={true}>Password</FormLabel>
          <Col >
            <FormControl type="password" placeholder="Password" onChange={(e) => this.handleChange(e)} />
          </Col>
        </FormGroup>

        {this.props.loginMessage &&
          <div style={{ marginBottom: '20px', color: 'red', fontSize: 'small' }}>
            <Col sm={{ span: 10, offset: 2 }} style={{ paddingLeft: '5px' }}>
              <i>Error: </i>{this.props.loginMessage}
            </Col>
          </div>
        }

        <FormGroup style={{paddingTop: 15, paddingBottom: 5}}>
          <Col>
            <Button style={{width: 90, backgroundColor: '#527984', borderColor: '#527984'}} type="submit" disabled={this.state.disableLogin} onClick={e => this.login(e)}>Login</Button>
            <Button variant="link" size="sm" style={{marginLeft: 85}} onClick={() => this.openRecoverPassword()}>Forgot your password?</Button>
          </Col>
        </FormGroup>
        
        <RecoverPassword show={this.state.forgottenPassword} onClose={() => this.closeRecoverPassword()} sessionToken={this.props.sessionToken} />

      </Form>
      
    );
  }
}

export default LoginForm;
