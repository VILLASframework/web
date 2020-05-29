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

class DashboardsDataManager extends RestDataManager{
  constructor() {
    super('dashboard', '/dashboards');
    this.onLoad = this.onDashboardsLoad
  }

  onDashboardsLoad(data, token){

    if (!Array.isArray(data)) {
      data = [data];
    }

    for (let dashboard of data){
      AppDispatcher.dispatch({
        type: 'widgets/start-load',
        token: token,
        param: '?dashboardID=' + dashboard.id
      });
    }
  }

}

export default new DashboardsDataManager();
