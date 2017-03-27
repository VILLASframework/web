/**
 * File: user-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import { ReduceStore } from 'flux/utils';

import AppDispatcher from '../app-dispatcher';
import UsersDataManager from '../data-managers/users-data-manager';
import NotificationsDataManager from '../data-managers/notifications-data-manager';

class UserStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return {
      users: [],
      currentUser: null,
      token: null
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case 'users/login':
        UsersDataManager.login(action.username, action.password);
        return state;

      case 'users/logout':
        // delete user and token
        return Object.assign({}, state, { token: null });

      case 'users/logged-in':
        // request logged-in user data
        UsersDataManager.getCurrentUser(action.token);

        return Object.assign({}, state, { token: action.token });

      case 'users/current-user':
        // save logged-in user
        return Object.assign({}, state, { currentUser: action.user });

      case 'users/current-user-error':
        // discard user token
        return Object.assign({}, state, { currentUser: null, token: null });

      case 'users/login-error':
        // server offline
        NotificationsDataManager.addNotification({
          title: 'Server offline',
          message: 'The server is offline. Please try again later.',
          level: 'error'
        });
        return state;

      default:
        return state;
    }
  }
}

export default new UserStore();
