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

class SimulatorsDataManager extends RestDataManager {
  constructor() {
    super('simulator', '/simulators');
  }

  isRunning(simulator) {
    // get path and name
    var path = simulator.endpoint.substring(0, simulator.endpoint.lastIndexOf('/'));
    path += '/nodes.json';

    var name = simulator.endpoint.substring(simulator.endpoint.lastIndexOf('/') + 1);

    // send request
    RestAPI.get('http://' + path).then(response => {
      // check if simulator is running
      var running = false;

      response.forEach(sim => {
        if (sim.name === name) {
          running = true;
        }
      });

      // report simulator running state
      simulator.running = running;

      AppDispatcher.dispatch({
        type: 'simulators/running',
        simulator: simulator,
        running: running
      });
    }).catch(error => {
      //console.log(error);
    });
  }
}

export default new SimulatorsDataManager();
