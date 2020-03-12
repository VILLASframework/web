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

  onConfigsLoad(data) {
    if (!Array.isArray(data))
      data = [ data ];

    for (let config of data)
      this.loadICData(config);
  }

  loadICData(config) {
    AppDispatcher.dispatch({
      type: 'icData/prepare',
      inputLength: parseInt(config.inputLength, 10),
      outputLength: parseInt(config.outputLength, 10),
      id: config.icID
    });
  }

  loadSignals(token, configs){

    for (let config of configs) {
      // request in signals
      RestAPI.get(this.makeURL('/signals?direction=in&configID=' + config.id), token).then(response => {
        AppDispatcher.dispatch({
          type: 'signals/loaded',
          data: response.signals
        });
      });

      // request out signals
      RestAPI.get(this.makeURL('/signals?direction=out&configID=' + config.id), token).then(response => {
        AppDispatcher.dispatch({
          type: 'signals/loaded',
          data: response.signals
        });
      });

    }
  }

  loadFiles(token, configs){
    for (let config of configs) {
      // request files of config
      RestAPI.get(this.makeURL('/files?objectType=config&objectID=' + config.id), token).then(response => {
        AppDispatcher.dispatch({
          type: 'files/loaded',
          data: response.files
        });
      });
    }
  }
}

export default new ConfigDataManager();
