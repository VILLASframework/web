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

import AppDispatcher from './app-dispatcher';
import NotificationsDataManager from '../common/data-managers/notifications-data-manager';

class ArrayStore extends ReduceStore {
  constructor(type, dataManager) {
    super(AppDispatcher);

    this.type = type;
    this.dataManager = dataManager;
  }

  getInitialState() {
    return [];
  }

  updateElements(state, newElements) {
    // search for existing element to update
    state.forEach((element, index, array) => {
      newElements = newElements.filter((updateElement, newIndex) => {
        if (element.id === updateElement.id) {
          // update each property
          for (var key in updateElement) {
            if (updateElement.hasOwnProperty(key)) {
              array[index][key] = updateElement[key];
            }
          }

          // remove updated element from update list
          return false;
        }

        return true;
      });
    });

    // all elements still in the list will just be added
    state = state.concat(newElements);

    // announce change to listeners
    this.__emitChange();

    return state;
  }

  reduce(state, action) {
    switch (action.type) {
      case this.type + '/start-load':
        if (Array.isArray(action.data)) {
          action.data.forEach((id) => {
            this.dataManager.load(id, action.token,action.param);
          });
        } else {
          this.dataManager.load(action.data, action.token,action.param);
        }
        return state;

      case this.type + '/loaded':
        if (Array.isArray(action.data)) {
          return this.updateElements(state, action.data);
        } else {
          return this.updateElements(state, [action.data]);
        }

      case this.type + '/load-error':
        if (action.error && !action.error.handled && action.error.response) {

          const USER_LOAD_ERROR_NOTIFICATION = {
            title: 'Failed to load',
            message: action.error.response.body.message,
            level: 'error'
          };
          NotificationsDataManager.addNotification(USER_LOAD_ERROR_NOTIFICATION);

        }
        return super.reduce(state, action);

      case this.type + '/start-add':
        this.dataManager.add(action.data, action.token,action.param);
        return state;

      case this.type + '/added':
        return this.updateElements(state, [action.data]);

      case this.type + '/add-error':

         return state;


      case this.type + '/start-remove':
        this.dataManager.remove(action.data, action.token,action.param);
        return state;

      case this.type + '/removed':
        return state.filter((item) => {
          return (item !== action.original);
        });

      case this.type + '/remove-error':
        if (action.error && !action.error.handled && action.error.response) {

          const USER_REMOVE_ERROR_NOTIFICATION = {
            title: 'Failed to add remove ',
            message: action.error.response.body.message,
            level: 'error'
          };
          NotificationsDataManager.addNotification(USER_REMOVE_ERROR_NOTIFICATION);

        }
        return super.reduce(state, action);

      case this.type + '/start-edit':
        if(action.id){
          this.dataManager.update(action.data, action.token,action.param,action.id);
        }
        else{
        this.dataManager.update(action.data, action.token,action.param);
        }
        return state;

      case this.type + '/edited':
        return this.updateElements(state, [action.data]);

      case this.type + '/edit-error':
          return state;

      default:
        return state;
    }
  }
}

export default ArrayStore;
