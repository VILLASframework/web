/**
 * File: simulators-data-manager.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

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
