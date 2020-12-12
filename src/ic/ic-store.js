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
import AppDispatcher from '../common/app-dispatcher';

class InfrastructureComponentStore extends ArrayStore {
  constructor() {
    super('ics', ICsDataManager);
  }

  reduce(state, action) {
    switch(action.type) {
      case 'ics/loaded':
        action.data.forEach(ic => {
          if (ic.type === "villas-node" || ic.type === "villas-relay") {
            let splitWebsocketURL = ic.websocketurl.split("/");
            AppDispatcher.dispatch({
              type: 'ic-status/get-status',
              url: ic.apiurl + "/status",
              socketname: splitWebsocketURL[splitWebsocketURL.length - 1],
              token: action.token,
              icid: ic.id,
            });
  
            AppDispatcher.dispatch({
              type: 'ic-graph/get-graph',
              url: ic.apiurl + "/graph.svg",
              socketname: splitWebsocketURL[splitWebsocketURL.length - 1],
              token: action.token,
              icid: ic.id,
            });
          }
        })

        return super.reduce(state, action);

      case 'ics/edited':
        // connect to each infrastructure component
        const ic = action.data;

        if (ic.websocketurl != null && ic.websocketurl !== '') {
          ICDataDataManager.update(ic.websocketurl, ic.id);
        }

        return super.reduce(state, action);
      case 'ics/open-sockets':
        // open websocket for each IC contained in array action.data
        // action.data contains only those IC used by the scenario
        for (let ic of action.data) {
          if (ic.websocketurl	!= null && ic.websocketurl !== '') {
            ICDataDataManager.open(ic.websocketurl, ic.id);
          } else {

            // TODO add to pool of notifications
            const IC_WEBSOCKET_URL_ERROR = {
              title: 'Websocket connection warning',
              message: "Websocket URL parameter not available for IC " + ic.name + "(" + ic.uuid + "), connection not possible",
              level: 'warning'
            };
            NotificationsDataManager.addNotification(IC_WEBSOCKET_URL_ERROR);
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
