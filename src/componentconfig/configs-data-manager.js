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
import AppDispatcher from '../common/app-dispatcher';
import RestAPI from "../common/api/rest-api";

class ConfigDataManager extends RestDataManager {
  constructor() {
    super('config', '/configs');

    this.onLoad = this.onConfigsLoad;
  }

  onConfigsLoad(data, token) {
    if (!Array.isArray(data))
      data = [ data ];

    for (let config of data) {

      // prepare IC data
      AppDispatcher.dispatch({
        type: 'icData/prepare',
        inputLength: parseInt(config.inputLength, 10),
        outputLength: parseInt(config.outputLength, 10),
        id: config.icID
      });

      // request in signals
      AppDispatcher.dispatch({
        type: 'signals/start-load',
        token: token,
        param: '?direction=in&configID=' + config.id,
      });

      // request out signals
      AppDispatcher.dispatch({
        type: 'signals/start-load',
        token: token,
        param: '?direction=out&configID=' + config.id,
      });
    }

  }
}

export default new ConfigDataManager();
