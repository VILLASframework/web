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
    // handle action
    state = super.reduce(state, action);

    if (action.type === 'simulators/loaded') {
      // get simulator running state
      if (Array.isArray(action.data)) {
        action.data.forEach((simulator) => {
          //SimulatorsDataManager.isRunning(simulator);
        });
      } else {
        //SimulatorsDataManager.isRunning(action.data);
      }
    } else if (action.type === 'simulators/running') {
      // set running state
      console.log(action);
    }

    return state;
  }
}

export default new SimulatorStore();
