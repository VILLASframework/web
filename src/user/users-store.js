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
import UsersDataManager from './users-data-manager';
import NotificationsDataManager from '../common/data-managers/notifications-data-manager';
import NotificationsFactory from "../common/data-managers/notifications-factory";

class UsersStore extends ArrayStore {
  constructor() {
    super('users', UsersDataManager);
  }

  reduce(state, action) {
    switch (action.type) {

      case this.type + '/add-error':
        if (action.error && !action.error.handled && action.error.response) {
          // If it was an error and hasn't been handled, user could not be added
          NotificationsDataManager.addNotification(
            NotificationsFactory.ADD_ERROR('Failed to add new user: ' + action.error.response.body.message));

        }
        return super.reduce(state, action);

      case this.type + '/edit-error':
        if (action.error && !action.error.handled && action.error.response) {
          // If it was an error and hasn't been handled, user couldn't not be updated
          NotificationsDataManager.addNotification(
            NotificationsFactory.UPDATE_ERROR('Failed to edit user: ' + action.error.response.body.message));

        }
        return super.reduce(state, action);

      default:
        return super.reduce(state, action);
    }
  }

}

export default new UsersStore();
