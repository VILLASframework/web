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
    console.log(action.type);

    switch (action.type) {
      case 'users/login':
        UsersDataManager.login(action.username, action.password);
        return state;

      case 'users/logout':
        // delete user and token
        return { token: null, currentUser: null };

      case 'users/logged-in':
        // request logged-in user data
        console.log(action.token);
        UsersDataManager.getCurrentUser(action.token);

        return Object.assign({}, state, { token: action.token });

      case 'users/current-user':
        // save logged-in user
        return Object.assign({}, state, { currentUser: action.user });

      case 'users/current-user-error':
        // discard user token
        //return { currentUser: null, token: null };
        return state;

      case 'users/login-error':
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new UserStore();
