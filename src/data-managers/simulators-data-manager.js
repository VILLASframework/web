/**
 * File: simulators-data-manager.js
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

import RestDataManager from './rest-data-manager';
import RestAPI from '../api/rest-api';
import AppDispatcher from '../app-dispatcher';

function isRunning(simulator) {
  // get path to nodes.json and simulator name
  var path = simulator.endpoint.substring(0, simulator.endpoint.lastIndexOf('/'));
  path += '/nodes.json';

  var name = simulator.endpoint.substring(simulator.endpoint.lastIndexOf('/') + 1);

  // send request
  RestAPI.get('http://' + path).then(response => {
    // check if simulator is running
    simulator.running = false;

    response.forEach(sim => {
      if (sim.name === name) {
        simulator.running = true;
      }
    });

    AppDispatcher.dispatch({
      type: 'simulators/running',
      simulator: simulator,
      running: simulator.running
    });
  }).catch(error => {
    simulator.running = false;

    AppDispatcher.dispatch({
      type: 'simulators/running',
      simulator: simulator,
      running: simulator.running
    });
  });
}

class SimulatorsDataManager extends RestDataManager {
  constructor() {
    super('simulator', '/simulators', [ '_id', 'name', 'endpoint' ]);

    this._timers = [];
  }

  startRunningDetection(obj) {
    const simulator = JSON.parse(JSON.stringify(obj));

    // check if timer is already running
    const index = this._timers.findIndex(timer => {
      return timer.simulator === simulator._id;
    });

    if (index !== -1) {
      return;
    }

    // do first request for fast response time
    isRunning(simulator);

    // start new timer
    const timerID = setInterval(isRunning, 5000, simulator);
    this._timers.push({ id: timerID, simulator: simulator._id });
  }

  stopRunningDetection(simulator) {
    // remove timer
    const index = this._timers.findIndex(timer => {
      return timer.simulator === simulator._id;
    });

    if (index !== -1) {
      // stop timer and delete from list
      clearInterval(this._timers[index].id);
      this._timers.splice(index, 1);
    }
  }
}

export default new SimulatorsDataManager();
