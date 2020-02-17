/**
 * File: simulation-model-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.04.2018
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

import ArrayStore from '../common/array-store';
import SimulationModelsDataManager from './simulation-models-data-manager';

class SimulationModelStore extends ArrayStore {

  constructor() {
    super('simulationModels', SimulationModelsDataManager);
  }

  reduce(state, action) {
    switch (action.type) {

      case 'simulationModels/loaded':

        SimulationModelsDataManager.loadSignals(action.token, action.data);
        return super.reduce(state, action);

      default:
        return super.reduce(state, action);

    }
  }
}

export default new SimulationModelStore();
