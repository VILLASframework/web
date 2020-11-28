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
import ICDataDataManager from './ic-data-data-manager';

class ICGraphStore extends ArrayStore {
  constructor() {
    super('ic-graph', ICDataDataManager);
  }

  saveGraph(state, action){

    let icID = parseInt(action.icid);    
    const dublicate = state.some(element => element.icID === icID);
    if(dublicate){
        return state
    }
    let icGraph = {};
    icGraph["icID"] = icID;
    icGraph["data"] = new Blob([action.data.data], {type: action.data.type});
    icGraph["type"] = action.data.type;
    icGraph["objectURL"] = URL.createObjectURL(icGraph["data"]);
    
    this.__emitChange();
    return this.updateElements(state, [icGraph]);
  }

  reduce(state, action) {
    switch(action.type) {

      case 'ic-graph/get-graph':
        ICDataDataManager.getGraph(action.url, action.socketname, action.token, action.icid);
        return super.reduce(state, action);

      case 'ic-graph/graph-received':
        return this.saveGraph(state, action);

      case 'ic-graph/graph-error':
        return super.reduce(state, action);

      default:
        return super.reduce(state, action);
    }
  }
}

export default new ICGraphStore();
