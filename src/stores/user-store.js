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

import AppDispatcher from '../app-dispatcher';
import UsersDataManager from '../data-managers/users-data-manager';
import NotificationsDataManager from '../data-managers/notifications-data-manager';
import SimulatorDataDataManager from '../data-managers/simulator-data-data-manager';

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
        // disconnect from all simulators
        SimulatorDataDataManager.closeAll();

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

        if (action.error && !action.error.handled) {
          // If it was an error and hasn't been handled, the credentials must have been wrong.
          const WRONG_CREDENTIALS_NOTIFICATION = {
            title: 'Incorrect credentials',
            message: 'Please modify and try again.',
            level: 'error'
          }
          NotificationsDataManager.addNotification(WRONG_CREDENTIALS_NOTIFICATION);

        }

        return state;    

      default:
        return state;
    }
  }
}

export default new UserStore();
