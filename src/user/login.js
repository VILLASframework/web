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
import { NavbarBrand } from 'react-bootstrap';
import NotificationSystem from 'react-notification-system';
import { Redirect } from 'react-router-dom';

import LoginForm from './login-form';
import Header from '../common/header';
import Footer from '../common/footer';
import NotificationsDataManager from '../common/data-managers/notifications-data-manager';
import LoginStore from './login-store'
import AppDispatcher from '../common/app-dispatcher';
import branding from '../branding/branding';


class Login extends Component {
  constructor(props) {
    super(props);

    // Load config in case the user goes directly to /login
    // otherwise it will be loaded in app constructor
    AppDispatcher.dispatch({
      type: 'config/load',
    });

    // set branding in case the login page gets refreshed
    if (!branding.isSet) {
      branding.applyBranding();
    }
  }

  static getStores() {
    return [LoginStore]
  }

  static calculateState(prevState, props) {
    // We need to work with the login store here to trigger the re-render upon state change after login
    // Upon successful login, the token and currentUser are stored in the local storage as strings
    return {
      loginMessage: LoginStore.getState().loginMessage,
      token: LoginStore.getState().token,
      currentUser: LoginStore.getState().currentUser,
      config: LoginStore.getState().config,
    }
  }

  componentDidMount() {
    NotificationsDataManager.setSystem(this.refs.notificationSystem);
  }

  render() {

    if (this.state.currentUser !== null && this.state.currentUser !== "") {
      return (<Redirect to="/home" />);
    }

    return (
      <div>
        <NotificationSystem ref="notificationSystem" />

        <Header />
        <div className="login-parent">
          <div className="login-welcome">
            {branding.getWelcome()}
          </div>

          <div className="login-container">
            <NavbarBrand>Login</NavbarBrand>

            <LoginForm loginMessage={this.state.loginMessage} config={this.state.config} />
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Login));
