/**
 * File: signals-data-manager.js
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

class SignalsDataManager extends RestDataManager{

  constructor() {
    super('signal', '/signals');
  }

  reloadSimulationModel(token, data){
    // request in signals
    console.log("Reloading simulation model due to signal add/remove")
    RestAPI.get(this.makeURL('/models/' + data.simulationModelID), token).then(response => {
      AppDispatcher.dispatch({
        type: 'simulationModels/edited',
        data: response.simulationModel
      });
    });

  }

}

export default new SignalsDataManager()
