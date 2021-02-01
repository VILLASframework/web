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
 ************************************************************s*****************/


import ScenariosDataManager from './scenarios-data-manager';
import ArrayStore from '../common/array-store';
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../common/data-managers/notifications-factory";


class ScenarioStore extends ArrayStore{
  constructor() {
    super('scenarios', ScenariosDataManager);
  }

  // store function, called when calls to backend have returned
  // save users after they are loaded ('getUsers' call)
  storeUsers(state, action) {
    let scenarioID = action.scenarioID;
    state.forEach((element, index, array) => {
      if (element.id === scenarioID) {
        array[index]["users"] = action.users;
      }
    })
    this.__emitChange();
    return state;
  }

  reduce(state, action) {
    switch (action.type) {

      case 'scenarios/start-add':

        // Check if this is a recursive scenario import or not
        if (action.data.hasOwnProperty("configs") || action.data.hasOwnProperty("dashboards")) {
          // import
          let subObjects = []
          let configs = {}
          let dashboards = {}

          if (action.data.hasOwnProperty("configs")){
            configs["configs"] = action.data.configs
            subObjects.push(configs)
            delete action.data.configs; // remove configs from scenario object
          }
          if (action.data.hasOwnProperty("dashboards")){
            dashboards["dashboards"] = action.data.dashboards
            subObjects.push(dashboards)
            delete action.data.dashboards; // remove dashboards from scenario object
          }

          // action.data should now contain the scenario and no sub-objects
          // sub-objects are treated in add method of RestDataManager
          this.dataManager.add(action.data, action.token,action.param, subObjects);
          return state

        } else {
          // no import
          return super.reduce(state, action);
        }

      case 'scenarios/start-load-users':
        this.dataManager.getUsers(action.token, action.data);
        return super.reduce(state, action);

      case 'scenarios/users-loaded':
        return this.storeUsers(state, action);

      case 'scenarios/add-user':
        this.dataManager.addUser(action.token, action.data, action.username);
        return super.reduce(state, action);

      case 'scenarios/remove-user':
        this.dataManager.deleteUser(action.token, action.data, action.username, action.ownuser)
        return super.reduce(state, action);

      case 'scenarios/users-error':
        if (action.error && !action.error.handled && action.error.response) {
          NotificationsDataManager.addNotification(NotificationsFactory.SCENARIO_USERS_ERROR(action.error.response.body.message));
        }
        return super.reduce(state, action);

      default:
        return super.reduce(state, action);
    }
  }


}

export default new ScenarioStore();
