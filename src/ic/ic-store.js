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

import ArrayStore from '../common/array-store';
import ICsDataManager from './ics-data-manager';
import ICDataDataManager from './ic-data-data-manager';
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";

class InfrastructureComponentStore extends ArrayStore {
  constructor() {
    super('ics', ICsDataManager);
  }

  reduce(state, action) {
    switch(action.type) {
      case 'ics/loaded':

        return super.reduce(state, action);

      case 'ics/edited':
        // connect to each infrastructure component
        const ic = action.data;

        if (ic.host != null && ic.host !== '') {
          ICDataDataManager.update(ic.host, ic.id);
        }

        return super.reduce(state, action);
      case 'ics/open-sockets':
        // open websocket for each IC contained in array action.data
        // TODO should be done when dashboard is loaded
        // TODO action.data should contain only those IC used by the scenario
        for (let ic of action.data) {
          if (ic.host != null && ic.host !== '') {
            // TODO connection should be closed again when dashboard is closed

            ICDataDataManager.open(ic.host, ic.id);
          } else {

            // TODO add to pool of notifications
            const IC_WEBSOCKET_HOST_ERROR = {
              title: 'Host of websocket not available',
              message: action.error.response.body.message,
              level: 'warning'
            };
            NotificationsDataManager.addNotification(IC_WEBSOCKET_HOST_ERROR);
          }
        }
        return super.reduce(state, action);

      case 'ics/close-sockets':
        // close all websockets
        ICDataDataManager.closeAll();
        return super.reduce(state, action);

      case 'ics/fetched':
        return this.updateElements(state, [action.data]);

      case 'ics/fetch-error':
        return state;

      case 'ics/start-action':
        if (!Array.isArray(action.data))
          action.data = [ action.data ]

        ICsDataManager.doActions(action.ic, action.data, action.token);
        return state;

      case 'ics/action-error':
        console.log(action.error);
        return state;

      default:
        return super.reduce(state, action);
    }
  }
}

export default new InfrastructureComponentStore();
