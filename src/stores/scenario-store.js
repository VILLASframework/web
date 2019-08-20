/**
 * File: scenario-store.js
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
 ************************************************************s*****************/

import ArrayStore from './array-store';
import ScenariosDataManager from '../data-managers/scenarios-data-manager';
import UsersDataManager from "../data-managers/users-data-manager";
import SimulatorDataDataManager from "../data-managers/simulator-data-data-manager";
import {ReduceStore} from "flux/utils";
import AppDispatcher from "../app-dispatcher";

//export default new ArrayStore('scenarios', ScenariosDataManager);


class ScenariosStore extends ReduceStore {
  constructor() {
    super('scenarios', ScenariosDataManager);
  }

  getInitialState() {
    return {
      scenarios: [],

    };
  }

  reduce(state, action) {
    switch (action.type) {
      case 'scenarios/load-models':
        // request simulation model data of scenario
        ScenariosDataManager.getSimulationModels(action.token, action.scenarioID);

        return Object.assign({}, state, { token: action.token, simulationmodels: action.simulationmodels});

      case 'scenarios/load-dashboards':
        // request dashboard data of scenario
        ScenariosDataManager.getDashboards(action.token, action.scenarioID);

        return Object.assign({}, state, { token: action.token, dashboards: action.dashboards});
      default:
        return state;
    }
  }
}

export default new ScenariosStore();
