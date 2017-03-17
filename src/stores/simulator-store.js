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
        // update simulator
        return this.updateElements(state, [ action.simulator ]);

      default:
        return super.reduce(state, action);
    }
  }
}

export default new SimulatorStore();
