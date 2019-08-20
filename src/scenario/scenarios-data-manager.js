/**
 * File: scenarios-data-manager.js
 * Author: Sonja Happ <sonja.happ@eonerc.rwth-aachen.de>
 * Date: 20.08.2019
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

import RestDataManager from '../common/data-managers/rest-data-manager';
import RestAPI from "../common/api/rest-api";
import AppDispatcher from "../common/app-dispatcher";

class ScenariosDataManager extends RestDataManager {
  constructor() {
    super('scenario', '/scenarios');
  }

  getSimulationModels(token, id) {
    RestAPI.get(this.makeURL('/scenarios/' + id + '/models'), token).then(response => {
      AppDispatcher.dispatch({
        type: 'scenarios/simulationmodels',
        simulationmodels: response.models
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'scenarios/simulationmodels-error',
        error: error
      });
    });
  }

  getDashboards(token, id) {
    RestAPI.get(this.makeURL('/scenarios/' + id + '/dashboards'), token).then(response => {
      AppDispatcher.dispatch({
        type: 'scenarios/dashboards',
        dashboards: response.dashboards
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'scenarios/dashboards-error',
        error: error
      });
    });
  }

}
export default new ScenariosDataManager();
