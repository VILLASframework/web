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
import AppDispatcher from "../common/app-dispatcher";
import RestAPI from '../common/api/rest-api';


class ScenariosDataManager extends RestDataManager {
  constructor() {
    super('scenario', '/scenarios');

    this.onLoad = this.onScenariosLoad
  }

  getUsers(token, id) {
    RestAPI.get(this.makeURL('/scenarios/' + id + '/users'), token).then(response => {
      AppDispatcher.dispatch({
        type: 'scenarios/users-loaded',
        users: response.users,
        scenarioID: id
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'scenarios/users-error',
        error: error
      })
    })
  }

  addUser(token, id, username) {
    let path = id + '/user';
    RestAPI.put(this.requestURL('load/add', path, '?username=' + username), null, token).then(response => {
      AppDispatcher.dispatch({
        type: 'scenarios/start-load-users',
        data: id,
        token: token
      });

    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'scenarios/users-error',
        error: error
      })
    })
  }

  deleteUser(token, id, username, ownuser=false) {
    let path = id + '/user';
    RestAPI.delete(this.makeURL(this.url + '/' + path + '?username=' + username), token).then(response => {
      if (!ownuser) {
        AppDispatcher.dispatch({
          type: 'scenarios/start-load-users',
          data: id,
          token: token
        });
      } else {
        // delete scenario from scenariostore
        AppDispatcher.dispatch({
          type: 'scenarios/removed',
          data: id,
          token: token
        });
      }
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'scenarios/users-error',
        error: error
      })
    })
  }

  onScenariosLoad(data, token) {

    if (!Array.isArray(data)) {
      data = [data];
    }

    for (let scenario of data) {
      AppDispatcher.dispatch({
        type: 'configs/start-load',
        token: token,
        param: '?scenarioID=' + scenario.id
      });

      AppDispatcher.dispatch({
        type: 'dashboards/start-load',
        token: token,
        param: '?scenarioID=' + scenario.id
      });

      AppDispatcher.dispatch({
        type: 'files/start-load',
        token: token,
        param: '?scenarioID=' + scenario.id,
      });

      AppDispatcher.dispatch({
        type: 'results/start-load',
        token: token,
        param: '?scenarioID=' + scenario.id
      })
    }
  }
}
export default new ScenariosDataManager();
