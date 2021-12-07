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

import RestDataManager from '../common/data-managers/rest-data-manager';
import RestAPI from '../common/api/rest-api';
import AppDispatcher from '../common/app-dispatcher';

class UsersDataManager extends RestDataManager {
  constructor() {
    super('user', '/users');
  }

  login(username, password) {
    if (username && password) {
      RestAPI.post(this.makeURL('/authenticate/internal'), { username: username, password: password }).then(response => {
        AppDispatcher.dispatch({
          type: 'users/logged-in',
          token: response.token,
          currentUser: response.user,
        });
      }).catch(error => {
        AppDispatcher.dispatch({
          type: 'users/login-error',
          error: error
        });
      });
    } else { // external authentication
      RestAPI.post(this.makeURL('/authenticate/external'), null, null, 60000).then(response => {
        console.log(response);
        AppDispatcher.dispatch({
          type: 'users/logged-in',
          token: response.token,
          currentUser: response.user,
        });
      }).catch(error => {
        AppDispatcher.dispatch({
          type: 'users/login-error',
          error: error
        });
      });
    }
  }
}

export default new UsersDataManager();
