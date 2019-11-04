/**
 * File: simulation-models-data-manager.js
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

import RestDataManager from './rest-data-manager';
import AppDispatcher from '../app-dispatcher';

class SimulationModelDataManager extends RestDataManager {
  constructor() {
    super('simulationModel', '/models');

    this.onLoad = this.onModelsLoad;
  }

  onModelsLoad(data) {
    if (!Array.isArray(data))
      data = [ data ];

    for (let model of data)
      this.loadModelData(model);
  }

  loadModelData(model) {
    AppDispatcher.dispatch({
      type: 'simulatorData/prepare',
      inputLength: parseInt(model.inputLength, 10),
      outputLength: parseInt(model.outputLength, 10),
      id: model.simulator
    });
  }
}

export default new SimulationModelDataManager();
