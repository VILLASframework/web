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

import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import RecoverPassword from './recover-password';
import NotificationsFactory from '../../common/data-managers/notifications-factory';
import notificationsDataManager from '../../common/data-managers/notifications-data-manager';
import { useAuthenticateUserMutation } from '../../store/apiSlice';
import { setUser } from '../../store/authSlice';

const LoginForm = ({config}) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [forgottenPassword, setForgottenPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [authenticationRequest] = useAuthenticateUserMutation();

  //this variable is used to disable login button if either username or password is empty
  const isInputValid = username !== '' && password !== '';

  const loginEvent = (event) => {
    event.preventDefault();
    authenticateUser();
  }

  const authenticateUser = async () => {
    try {
      const res = await authenticationRequest({mechanism: "internal", username: username, password: password});
      if(res.error) {
        setLoginMessage(res.error.data.message);
      } else {
        dispatch(setUser({user: res.data.user, token: res.data.token}));
        setLoginMessage('');
      }
    } catch (err) {
      if(err.data){
        notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
      } else {
        console.log('Error', err);
      }
    }
  }

  const villasLogin = (
    <Form key="login_a">
      <Form.Group controlId="username">
        <Form.Label column={true}>Username</Form.Label>
        <Col>
          <Form.Control 
            type="text" 
            placeholder="Username" 
            autoComplete="username" 
            onChange={(e) => {
              setUsername(e.target.value)
            }
          } />
        </Col>
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label column={true}>Password</Form.Label>
        <Col >
          <Form.Control 
            type="password" 
            placeholder="Password" 
            autoComplete="current-password" 
            onChange={(e) => {
              setPassword(e.target.value)
              }} 
            />
        </Col>
      </Form.Group>

      {loginMessage &&
        <div style={{ marginBottom: '20px', color: 'red', fontSize: 'small' }}>
          <Col sm={{ span: 10, offset: 2 }} style={{ paddingLeft: '5px' }}>
            <i>Error: </i>{loginMessage}
          </Col>
        </div>
      }

      <Form.Group style={{ paddingTop: 15, paddingBottom: 5 }}>
        <Col>
        <span className='solid-button'>
          <Button variant='secondary' style={{width: 90}} type="submit" disabled={!isInputValid} onClick={e => loginEvent(e)}>Login</Button>
        </span>
          <Button variant="link" size="sm" style={{marginLeft: 85, textDecoration: "none"}} onClick={() => setForgottenPassword(true)}>Forgot your password?</Button>
        </Col>
      </Form.Group>

      <RecoverPassword show={forgottenPassword} onClose={() => setForgottenPassword(false)} config={config} />
    </Form>
  );

  if (config) {
    let externalLogin = _.get(config, ['authentication', 'external', 'enabled'])
    let provider = _.get(config, ['authentication', 'external', 'provider_name'])
    let url = _.get(config, ['authentication', 'external', 'authorize_url']) + "?rd=/login/complete"

    if (externalLogin && provider && url) {
      return [
        villasLogin,
        <hr key="login_b"/>,
        <Button key="login_c" onClick={e => window.location = url } block>Sign in with {provider}</Button>
      ];
    }
  }

  return villasLogin;
}

export default LoginForm;
