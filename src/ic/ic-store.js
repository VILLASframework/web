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
import NotificationsFactory from "../common/data-managers/notifications-factory";
import AppDispatcher from '../common/app-dispatcher';

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
            NotificationsDataManager.addNotification(NotificationsFactory.WEBSOCKET_URL_WARN(ic.name, ic.uuid));
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
        if (!Array.isArray(action.action))
          action.action = [ action.action ]

        ICsDataManager.doActions(action.icid, action.action, action.token, action.result);
        return state;

      case 'ics/action-error':
        console.log(action.error);
        return state;

      case 'ics/action-result-added':

        for (let a of action.actions){

          if (a.results !== undefined && a.results != null){
            // adapt URL for newly created result ID
            a.results.url = a.results.url.replace("RESULTID", action.data.result.id);
            a.results.url = ICsDataManager.makeURL(a.results.url);
            a.results.url = window.location.host + a.results.url;
          }
          if (a.model !== undefined && a.model != null && JSON.stringify(a.model) !== JSON.stringify({})) {
            // adapt URL for model file
            a.model.url = ICsDataManager.makeURL(a.model.url);
            a.model.url = window.location.host + a.model.url;
          }
          ICsDataManager.doActions(a.icid, [a], action.token)
        }
        return state;

      case 'ics/action-result-add-error':
        console.log(action.error);
        return state

      case 'ics/get-status':
        ICsDataManager.getStatus(action.url, action.token, action.ic);
        return super.reduce(state, action);

      case 'ics/status-received':
        let tempIC = action.ic;
        if(!tempIC.managedexternally){
          tempIC.state = action.data.state;
          tempIC.uptime = action.data.time_now - action.data.time_started;
          tempIC.statusupdateraw = action.data;
          AppDispatcher.dispatch({
            type: 'ics/start-edit',
            data: tempIC,
            token: action.token,
          });
        }
        return super.reduce(state, action);

      case 'ics/status-error':
        console.log("status error:", action.error);
        return super.reduce(state, action);

      case 'ics/restart':
        ICsDataManager.restart(action.url, action.token);
        return super.reduce(state, action);

      case 'ics/restart-successful':
        console.log("restart response:", action.data);
        return super.reduce(state, action);

      case 'ics/restart-error':
        console.log("restart error:", action.error);
        return super.reduce(state, action);

      case 'ics/shutdown':
        ICsDataManager.shutdown(action.url, action.token);
        return super.reduce(state, action);

      case 'ics/shutdown-successful':
        console.log("shutdown response:", action.data);
        return super.reduce(state, action);

      case 'ics/shutdown-error':
        console.log("shutdown error:", action.error);
        return super.reduce(state, action);

      default:
        return super.reduce(state, action);
    }
  }
}

export default new InfrastructureComponentStore();
