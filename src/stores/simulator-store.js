/**
 * File: villas-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
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
import SimulatorsDataManager from '../data-managers/simulators-data-manager';
import NotificationsDataManager from '../data-managers/notifications-data-manager';

class SimulatorStore extends ArrayStore {
  constructor() {
    super('simulators', SimulatorsDataManager);
  }

  reduce(state, action) {
    var simulator;

    switch (action.type) {

      case 'simulators/added':
        SimulatorsDataManager.startRunningDetection(action.data);

        return super.reduce(state, action);

      case 'simulators/removed':
        SimulatorsDataManager.stopRunningDetection(action.original);

        return super.reduce(state, action);

      case 'simulators/start-edit':
        // An update will be requested, stop the 'runningDetection' already
        SimulatorsDataManager.stopRunningDetection(action.data);

        return super.reduce(state, action);

      case 'simulators/edited':
        // The update was done, resume the 'runningDetection'
        SimulatorsDataManager.startRunningDetection(action.data);

        return super.reduce(state, action);

      case 'simulators/loaded':
        // get simulator running state
        if (Array.isArray(action.data)) {
          action.data.forEach((simulator) => {
            SimulatorsDataManager.startRunningDetection(simulator);
          });
        } else {
          SimulatorsDataManager.startRunningDetection(action.data);
        }

        return super.reduce(state, action);

      case 'simulators/running':
        // check if simulator running state changed
        simulator = state.find(element => element._id === action.simulator._id );

        // is this simulator still in the state? update it only if state changed
        if (simulator && simulator.running !== action.simulator.running) {
          state = this.updateElements(state, [ action.simulator ]);
        }

        return state;

      case 'simulatorData/opened':
        // get simulator
        simulator = state.find(element => {
          return element._id === action.identifier;
        });

        if (action.firstOpen === false) {
          NotificationsDataManager.addNotification({
            title: 'Simulator online',
            message: 'Simulator \'' + simulator.name + '\' went online.',
            level: 'info'
          });
        }

        // restart requesting again
        SimulatorsDataManager.stopRunningDetection(simulator);

        return state;

      case 'simulatorData/closed':
        // get simulator
        simulator = state.find(element => {
          return element._id === action.identifier;
        });

        // update running state
        simulator.running = false;

        if (action.notification) {
          NotificationsDataManager.addNotification({
            title: 'Simulator offline',
            message: 'Simulator \'' + simulator.name + '\' went offline.',
            level: 'info'
          });

          // restart requesting again
          SimulatorsDataManager.startRunningDetection(simulator);
        }

        return this.updateElements(state, [ simulator ]);

      default:
        return super.reduce(state, action);
    }
  }
}

export default new SimulatorStore();
