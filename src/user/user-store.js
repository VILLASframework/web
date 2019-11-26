/**
 * File: user-store.js
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

import { ReduceStore } from 'flux/utils';

import AppDispatcher from '../common/app-dispatcher';
import UsersDataManager from './users-data-manager';
import SimulatorDataDataManager from '../simulator/simulator-data-data-manager';

class UserStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return {
      users: [],
      currentUser: null,
      token: null,
      userid: 0,
      loginMessage: null
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case 'users/login':
        UsersDataManager.login(action.username, action.password);
        return Object.assign({}, state, { loginMessage: null });

      case 'users/logout':
        // disconnect from all simulators
        SimulatorDataDataManager.closeAll();

        // delete user and token
        return Object.assign({}, state, { token: null, currentUser: null });

      case 'users/logged-in':
        // // request logged-in user data
     
        UsersDataManager.getCurrentUser(action.token, action.userid);

        return Object.assign({}, state, { token: action.token, userid: action.userid});

      case 'users/current-user':
      //  // save logged-in user
        return Object.assign({}, state, { currentUser: action.user});

      case 'users/reload-current-user':

          UsersDataManager.getCurrentUser(action.token, action.userid);

        return  Object.assign({}, state, { token: action.token, userid: action.userid});
        
      case 'users/current-user-error':
        // discard user token
        return Object.assign({}, state, { currentUser: null, token: null });

      case 'users/login-error':
        if (action.error && !action.error.handled) {
          // If it was an error and hasn't been handled, the credentials must have been wrong.
          state = Object.assign({}, state, { loginMessage: 'Wrong credentials! Please try again.' });
        }

        return state;

      default:
        return state;
    }
  }
}

export default new UserStore();
