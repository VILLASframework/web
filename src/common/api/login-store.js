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
import ConfigReader from '../config-reader';

class LoginStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return {
      currentUser: null,
      token: null,
      loginMessage: null,
      config: null,
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case 'config/load':
        ConfigReader.loadConfig();
        return state;

      case 'config/loaded':
        return Object.assign({}, state, { config: action.data });

      case 'config/load-error':
        return Object.assign({}, state, { config: null});

      case 'users/login':
        UsersDataManager.login(action.username, action.password);
        return Object.assign({}, state, { loginMessage: null });

      case 'users/extlogin':
        UsersDataManager.login();
        return Object.assign({}, state, { loginMessage: null });

      case 'users/logout':
        // disconnect from all infrastructure components
        ICDataDataManager.closeAll();
        //remove token and current user from local storage
        localStorage.clear();

        // delete user, token and loginMessage
        return Object.assign({}, state, { token: null, currentUser: null, loginMessage: null});

      case 'users/logged-in':
        // save login data in local storage and loginStore
        let newState = state
        if (action.token != null){
          localStorage.setItem('token', action.token);
          newState = Object.assign({}, state, {token: action.token})
        }
        localStorage.setItem('currentUser', JSON.stringify(action.currentUser));
        return Object.assign({}, newState, { currentUser: action.currentUser});

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

export default new LoginStore();
