/**
 * File: villas-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import { ReduceStore } from 'flux/utils';

import AppDispatcher from '../app-dispatcher';
import SimulatorsDataManager from '../data-managers/simulators-data-manager';

class SimulatorStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return [];
  }

  reduce(state, action) {
    console.log(action.type);

    switch (action.type) {
      case 'simulators/start-load':
        SimulatorsDataManager.loadSimulators();
        return state;

      case 'simulators/loaded':
        return action.simulators;

      case 'simulators/load-error':
        // TODO: Add error message
        return state;

      case 'simulators/start-add':
        SimulatorsDataManager.addSimulator(action.simulator);
        return state;

      case 'simulators/added':
        // state should always be immutable, thus make new copy
        var simulators = state.slice();
        simulators.push(action.simulator);
        
        return simulators;

      case 'simulators/add-error':
        // TODO: Add error message
        return state;

      default:
        return state;
    }
  }
}

export default new SimulatorStore();
