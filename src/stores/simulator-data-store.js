/**
 * File: simulator-data-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
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

import { ReduceStore } from 'flux/utils';

import AppDispatcher from '../app-dispatcher';
import SimulatorDataDataManager from '../data-managers/simulator-data-data-manager';

const MAX_VALUES = 10000;

class SimulationDataStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return {};
  }

  reduce(state, action) {
    var i;

    switch (action.type) {
      case 'simulatorData/open':
        SimulatorDataDataManager.open(action.endpoint, action.node);
        return state;

      case 'simulatorData/opened':
        // create entry for simulator
        state[action.node._id] = {};

        action.node.simulators.forEach(simulator => {
          state[action.node._id][simulator.id] = { sequence: -1, values: [] };
        });

        return state;

      case 'simulatorData/data-changed':
        // only add data, if newer than current
        if (state[action.node._id][action.data.id].sequence < action.data.sequence) {
          // add data to simulator
          for (i = 0; i < action.data.length; i++) {
            while (state[action.node._id][action.data.id].values.length < i + 1) {
              state[action.node._id][action.data.id].values.push([]);
            }

            state[action.node._id][action.data.id].values[i].push({ x: action.data.timestamp, y: action.data.values[i] });

            // erase old values
            if (state[action.node._id][action.data.id].values[i].length > MAX_VALUES) {
              const pos = state[action.node._id][action.data.id].values[i].length - MAX_VALUES;
              state[action.node._id][action.data.id].values[i].splice(0, pos);
            }
          }

          // update metadata
          state[action.node._id][action.data.id].timestamp = action.data.timestamp;
          state[action.node._id][action.data.id].sequence = action.data.sequence;

          // explicit call to prevent array copy
          this.__emitChange();
        } else {
          console.log('same sequence ' + state[action.node._id][action.data.id].sequence + ' ' + action.data.sequence);
        }

        return state;

      case 'simulatorData/closed':
        // close and delete socket
        if (state[action.node] != null) {
          // delete data
          //delete state[action.identifier];
          //state[action.identifier] = null;

          //this.__emitChange();
        }

        return state;

      default:
        return state;
    }
  }
}

export default new SimulationDataStore();
