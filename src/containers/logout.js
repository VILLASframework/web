/**
 * File: logout.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';

import AppDispatcher from '../app-dispatcher';
import UserStore from '../stores/villas-store';

class Home extends Component {
  static getStores() {
    return [ UserStore ];
  }

  static calculateState() {
    return {
      currentUser: UserStore.getState().currentUser
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'users/logout'
    });
  }

  componentWillUpdate(nextProps, nextState) {
    // check if logged out
    if (nextState.currentUser == null) {
      // discard login token
      localStorage.setItem('token', '');

      // transition to login page
      nextProps.router.push('/login');
    }
  }

  render() {
    return (
      <span>Login out</span>
    );
  }
}

export default Container.create(Home);
