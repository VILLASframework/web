/**
 * File: villas-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import ArrayStore from './array-store';
import SimulatorsDataManager from '../data-managers/simulators-data-manager';

class SimulatorStore extends ArrayStore {
  constructor() {
    super('simulators', SimulatorsDataManager);
  }

  reduce(state, action) {
    switch (action.type) {
      case 'simulators/loaded':
      case 'simulators/is-running':
        // get simulator running state
        if (Array.isArray(action.data)) {
          action.data.forEach((simulator) => {
            SimulatorsDataManager.isRunning(simulator);
          });
        } else {
          SimulatorsDataManager.isRunning(action.data);
        }

        return super.reduce(state, action);

      case 'simulators/running':
        return this.updateElements(state, [ action.simulator ]);

      case 'simulatorData/closed':
        // get simulator
        var simulator = state.find(element => {
          return element._id === action.identifier;
        });

        // update running state
        simulator.running = false;

        // restart requesting again
        SimulatorsDataManager.isRunning(simulator);

        return this.updateElements(state, [ simulator ]);

      default:
        return super.reduce(state, action);
    }
  }
}

export default new SimulatorStore();
