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
import RestAPI from "../common/api/rest-api";
import AppDispatcher from "../common/app-dispatcher";

class SignalsDataManager extends RestDataManager{

  constructor() {
    super('signal', '/signals');
  }

  reloadConfig(token, data){
    // request in signals
    RestAPI.get(this.makeURL('/configs/' + data.configID), token).then(response => {
      AppDispatcher.dispatch({
        type: 'configs/edited',
        data: response.config
      });
    });

  }

  startAutoConfig(data, url){
    // This function queries the VILLASnode API to obtain the configuration of the VILLASnode located at url
    // Endpoint: http[s]://server:port/api/v1 (to be generated based on IC host, port 4000)
    // data contains the request data: { action, id, (request)}
    // See documentation of VILLASnode API: https://villas.fein-aachen.org/doc/node-dev-api-node.html

    RestAPI.post(url, data).then(response => {
      AppDispatcher.dispatch({
        type: 'signals/autoconfig-loaded',
        data: response
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'signals/autoconfig-error',
        error: error
      })
    })
  }

}

export default new SignalsDataManager()
