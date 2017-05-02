/**
 * File: users-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
 *
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

import ArrayStore from './array-store';
import UsersDataManager from '../data-managers/users-data-manager';

class UsersStore extends ArrayStore {
  constructor() {
    super('users', UsersDataManager);
  }

  reduce(state, action) {
    switch (action.type) {

      default:
        return super.reduce(state, action);
    }
  }

}

export default new UsersStore();
