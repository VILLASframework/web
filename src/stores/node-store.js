/**
 * File: node-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2017
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

import ArrayStore from './array-store';
import NodesDataManager from '../data-managers/nodes-data-manager';

class NodeStore extends ArrayStore {
  constructor() {
    super('nodes', NodesDataManager);
  }

  reduce(state, action) {
    switch(action.type) {
      case 'nodes/loaded':
        // get simulator IDs
        if (Array.isArray(action.data)) {
          action.data.forEach(node => {
            NodesDataManager.getSimulators(node);
          });
        } else {
          NodesDataManager.getSimulators(action.data);
        }

        return super.reduce(state, action);

      default:
        return super.reduce(state, action);
    }
  }
}

export default new NodeStore();
