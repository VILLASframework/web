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

    let icGraph = {};
    icGraph["icID"] = action.icid;
    icGraph["data"] = new Blob([action.data.data], {type: action.data.type});
    icGraph["type"] = action.data.type;
    icGraph["objectURL"] = URL.createObjectURL(icGraph["data"]);

    let newElements = [icGraph]

    // search for existing element to update
    state.forEach((element, index, array) => {
      newElements = newElements.filter((updateElement, newIndex) => {
        if (element.icID === updateElement.icID) {
          console.log("Updating graph:", icGraph.icID)
          // update each property
          for (var key in updateElement) {
            if (updateElement.hasOwnProperty(key) && key === "objectURL") {
              URL.revokeObjectURL(array[index][key]);
              console.log("revoked objectURL", array[index][key])
            } else if (updateElement.hasOwnProperty(key)){
              array[index][key] = updateElement[key];
            }

          }

          // remove updated element from update list
          return false;
        }

        return true;
      });
    });

    // all elements still in the list will just be added
    state = state.concat(newElements);

    // announce change to listeners
    this.__emitChange();

    return state;

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
