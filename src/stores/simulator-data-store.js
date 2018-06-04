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
    switch (action.type) {
      case 'simulatorData/opened':
        // create entry for simulator
        if (state[action.id] === undefined)
            state[action.id] = {};

        return state;

      case 'simulatorData/prepare':
        state[action.id] = {
          output: {
            sequence: -1,
            length: action.outputLength,
            values: []
          },
          input: {
            sequence: -1,
            length: action.inputLength,
            version: 2,
            type: 0,
            timestamp: Date.now(),
            values: new Array(action.inputLength).fill(0)
          }
        };

        this.__emitChange();
        return state;

      case 'simulatorData/data-changed':
        // get index for simulator id
        if (state[action.id] == null) {
          return state;
        }

        if (state[action.id].output == null) {
          state[action.id].output = {
            values: []
          };
        }

        // loop over all samples in a vector
        for (let j = 0; j < action.data.length; j++) {
          let smp = action.data[j];

          // add data to simulator
          for (let i = 0; i < smp.length; i++) {
            while (state[action.id].output.values.length < i + 1) {
              state[action.id].output.values.push([]);
            }

            state[action.id].output.values[i].push({ x: smp.timestamp, y: smp.values[i] });

            // erase old values
            if (state[action.id].output.values[i].length > MAX_VALUES) {
              const pos = state[action.id].output.values[i].length - MAX_VALUES;
              state[action.id].output.values[i].splice(0, pos);
            }
          }

          // update metadata
          state[action.id].output.timestamp = smp.timestamp;
          state[action.id].output.sequence = smp.sequence;
        }

        // explicit call to prevent array copy
        this.__emitChange();

        return state;

      case 'simulatorData/inputChanged':
        // find simulator in node array
        if (state[action.simulator] == null) {
          return state;
        }

        // update message properties
        state[action.simulator].input.timestamp = Date.now();
        state[action.simulator].input.sequence++;
        state[action.simulator].input.values[action.signal] = action.data;

        SimulatorDataDataManager.send(state[action.simulator].input, action.simulator);

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
