/**
 * File: login.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
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
import { NavbarBrand } from 'react-bootstrap';
import NotificationSystem from 'react-notification-system';
import { Redirect } from 'react-router-dom';

import LoginForm from './login-form';
import Header from '../common/header';
import Footer from '../common/footer';
import NotificationsDataManager from '../common/data-managers/notifications-data-manager';

import AppDispatcher from '../common/app-dispatcher';
import LoginStore from './login-store';

class Login extends Component {
  static getStores() {
    return [ LoginStore ];
  }

  static calculateState() {
    return {
      currentUser: LoginStore.getState().currentUser,
      token: LoginStore.getState().token,
      loginMessage: LoginStore.getState().loginMessage,
    };
  }

  componentDidMount() {
    NotificationsDataManager.setSystem(this.refs.notificationSystem);
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {

    // if token stored locally, request user
    if (this.state.token == null) {
      const token = localStorage.getItem('token');
      const currentUser = localStorage.getItem('currentUser');

      if (token != null && token !== '' && this.state.currentUser == null) {
        AppDispatcher.dispatch({
          type: 'users/logged-in',
          token: token,
          currentUser: currentUser
        });
      }
    } else {
      // check if logged in
      if (this.state.currentUser != null) {
        // save login in local storage
        localStorage.setItem('token', this.state.token);
        localStorage.setItem('currentUser', JSON.stringify(this.state.currentUser));
      }
    }

  }

  render() {
    if (this.state.currentUser != null) {
      return (<Redirect to="/" />);
    }

    return (
      <div>
        <NotificationSystem ref="notificationSystem" />

        <Header />

        <div className="login-container">
          <NavbarBrand>Login</NavbarBrand>

          <LoginForm loginMessage={this.state.loginMessage} />
        </div>

        <Footer />
      </div>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Login));
