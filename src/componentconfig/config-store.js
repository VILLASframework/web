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
import ConfigsDataManager from './configs-data-manager';

class ConfigStore extends ArrayStore {

  constructor() {
    super('configs', ConfigsDataManager);
  }

  reduce(state, action) {
    switch (action.type) {

      case 'configs/loaded':

        ConfigsDataManager.loadFiles(action.token, action.data);
        return super.reduce(state, action);

      case 'configs/start-add':
        // Check if this is a recursive component config import or not
        if (action.data.hasOwnProperty("outputMapping") || action.data.hasOwnProperty("inputMapping")) {
          // import
          let subObjects = []
          let outputMapping = {}
          let inputMapping = {}

          if (action.data.hasOwnProperty("outputMapping")){
            outputMapping["signals"] = action.data.outputMapping
            subObjects.push(outputMapping)
            delete action.data.outputMapping; // remove outputMapping signals from config object
          }
          if (action.data.hasOwnProperty("inputMapping")){
            inputMapping["signals"] = action.data.inputMapping
            subObjects.push(inputMapping)
            delete action.data.inputMapping; // remove inputMapping signals from config object
          }

          // action.data should now contain the config and no sub-objects
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

export default new ConfigStore();
