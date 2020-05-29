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
import DashboardsDataManager from './dashboards-data-manager';

class DashboardStore extends  ArrayStore {
  constructor() {
    super('dashboards', DashboardsDataManager);
  }

  reduce(state, action) {

    switch (action.type) {
      case 'dashboards/start-add':

        // Check if this is a recursive dashboard import or not
        if (action.data.hasOwnProperty("widgets")) {
          // import
          let subObjects = []
          let widgets = {}
          widgets["widgets"] = action.data.widgets
          subObjects.push(widgets)
          delete action.data.widgets; // remove widgets from dashboard object

          // action.data should now contain the dashboard and no sub-objects
          // sub-objects are treated in add method of RestDataManager
          this.dataManager.add(action.data, action.token,action.param, subObjects);
          return state

        } else {
          // no import
          return super.reduce(state, action);
        }

      default:
        return super.reduce(state, action);
    }
  }

}

export default new DashboardStore();
