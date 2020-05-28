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

import { ReduceStore } from 'flux/utils';

import AppDispatcher from '../common/app-dispatcher';
import UsersDataManager from './users-data-manager';
import ICDataDataManager from '../ic/ic-data-data-manager';

class LoginStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return {
      currentUser: null,
      token: null,
      loginMessage: null,
      scenarioUsers: null
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case 'users/login':
        UsersDataManager.login(action.username, action.password);
        return Object.assign({}, state, { loginMessage: null });

      case 'users/logout':
        // disconnect from all infrastructure components
        ICDataDataManager.closeAll();
        //remove token and current user from local storage
        localStorage.clear();

        // delete user and token
        return Object.assign({}, state, { token: null, currentUser: null });

      case 'users/logged-in':
        // // request logged-in user data
        UsersDataManager.getCurrentUser(action.token, action.currentUser.id);
        return Object.assign({}, state, { token: action.token, currentUser: action.currentUser});

      case 'users/current-user':
      //  // save logged-in user
        return Object.assign({}, state, { currentUser: action.currentUser});

      case 'users/start-edit-own-user':
        // update the current user
        UsersDataManager.updateCurrentUser(action.token, action.data);
        return Object.assign({}, state, { token: action.token, currentUser: action.data});

      case 'users/reload-current-user':
        UsersDataManager.getCurrentUser(action.token, action.currentUser.id);
        return  Object.assign({}, state, { token: action.token, currentUser: action.currentUser});

      case 'users/current-user-error':
        // discard user token
        return Object.assign({}, state, { currentUser: null, token: null });

      case 'users/login-error':
        if (action.error && !action.error.handled) {
          // If it was an error and hasn't been handled, the credentials must have been wrong.
          state = Object.assign({}, state, { loginMessage: 'Wrong credentials! Please try again.' });
        }
        return state;

      case 'scenarios/users':
        state.scenarioUsers = action.users;
        return state;

      case 'scenarios/users-error':
        return state;

      default:
        return state;
    }
  }
}

export default new LoginStore();
