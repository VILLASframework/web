/**
 * File: simulator-data-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

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
        SimulatorDataDataManager.open(action.endpoint, action.identifier, action.signals);
        return state;

      case 'simulatorData/opened':
        // create entry for simulator
        state[action.identifier] = { signals: action.signals, values: [], sequence: null, timestamp: null };

        for (i = 0; i < action.signals; i++) {
          state[action.identifier].values.push([]);
        }

        return state;

      case 'simulatorData/data-changed':
        // add data to simulator
        for (i = 0; i < state[action.identifier].signals; i++) {
          state[action.identifier].values[i].push({ x: action.data.timestamp, y: action.data.values[i] });

          // erase old values
          if (state[action.identifier].values[i].length > MAX_VALUES) {
            const pos = state[action.identifier].values[i].length - MAX_VALUES;
            state[action.identifier].values[i].splice(0, pos);
          }
        }

        // update metadata
        state[action.identifier].timestamp = action.data.timestamp;
        state[action.identifier].sequence = action.data.sequence;

        // explicit call to prevent array copy
        this.__emitChange();

        return state;

      case 'simulatorData/closed':
        // close and delete socket
        state[action.identifier].close();
        state[action.identifier] = null;

        this.__emitChange();
        return state;

      default:
        return state;
    }
  }
}

export default new SimulationDataStore();
