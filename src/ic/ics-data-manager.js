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

class IcsDataManager extends RestDataManager {
  constructor() {
    super('ic', '/ic');
  }

  sendActionRequest(icId, actions, token = null) {
    RestAPI.post(this.makeURL(this.url + '/' + icId + '/action'), actions, token).then(response => {
      AppDispatcher.dispatch({
        type: 'ics/action-started',
        data: response
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'ics/action-error',
        error
      });
    });
  }

  doActionsForIC(icid, actions, token = null) {
    for (let action of actions) {
      if (action.when) {
        // Send timestamp as Unix Timestamp
        action.when = Math.round(new Date(action.when).getTime() / 1000);
      }
    }
    this.sendActionRequest(icid, actions, token)
  }

  doActionForMultipleICs(actions, result = null, token = null) {
    if (result) {
      this.doStartResultAction(actions, result, token)
      return
    }

    for (let a of actions) {
      if (a.when) {
        // Send timestamp as Unix Timestamp
        a.when = Math.round(new Date(a.when).getTime() / 1000);
      }
      this.sendActionRequest(a.icid, [a], token)
    }
  }

  doStartResultAction(actions, result, token = null) {
    RestAPI.post(this.makeURL('/results'), result, token).then(response => {
      AppDispatcher.dispatch({
        type: 'ics/action-result-added',
        data: response,
        actions: actions,
        token: token,
      });

      AppDispatcher.dispatch({
        type: "results/added",
        data: response.result,
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'ics/action-result-add-error',
        error
      });
    });
  }

  restart(url, token) {
    RestAPI.post(url, null).then(response => {
      AppDispatcher.dispatch({
        type: 'ics/restart-successful',
        data: response,
        token: token,
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'ics/restart-error',
        error: error
      })
    })
  }

  shutdown(url, token) {
    RestAPI.post(url, null).then(response => {
      AppDispatcher.dispatch({
        type: 'ics/shutdown-successful',
        data: response,
        token: token,
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'ics/shutdown-error',
        error: error
      })
    })
  }
}

export default new IcsDataManager();
