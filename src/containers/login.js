/**
 * File: login.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { PageHeader } from 'react-bootstrap';
import NotificationSystem from 'react-notification-system';

import LoginForm from '../components/login-form';
import Header from '../components/header';
import Footer from '../components/footer';
import NotificationsDataManager from '../data-managers/notifications-data-manager';

import AppDispatcher from '../app-dispatcher';
import UserStore from '../stores/user-store';

class Login extends Component {
  static getStores() {
    return [ UserStore ];
  }

  static calculateState() {
    return {
      currentUser: UserStore.getState().currentUser,
      token: UserStore.getState().token
    };
  }

  componentDidMount() {
    NotificationsDataManager.setSystem(this.refs.notificationSystem);
  }

  componentWillUpdate(nextProps, nextState) {
    // if token stored locally, request user
    if (nextState.token == null) {
      const token = localStorage.getItem('token');

      if (token != null && token !== '' && nextState.currentUser == null) {
        AppDispatcher.dispatch({
          type: 'users/logged-in',
          token: token
        });
      }
    } else {
      // check if logged in
      if (nextState.currentUser != null) {
        // save login in local storage
        localStorage.setItem('token', nextState.token);

        // transition to index
        nextProps.router.push('/');
      }
    }
  }

  render() {
    return (
      <div>
        <NotificationSystem ref="notificationSystem" />

        <Header />

        <div className="login-container">
          <PageHeader>Login</PageHeader>

          <LoginForm />
        </div>

        <Footer />
      </div>
    );
  }
}

export default Container.create(Login);
