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
    super('simulator', '/simulators', [ '_id', 'name', 'endpoint' ]);

    this._timers = [];
  }

  isRunning(simulator) {
    // get path and name
    var path = simulator.endpoint.substring(0, simulator.endpoint.lastIndexOf('/'));
    path += '/nodes.json';

    var name = simulator.endpoint.substring(simulator.endpoint.lastIndexOf('/') + 1);

    // send request
    RestAPI.get('http://' + path).then(response => {
      // check if simulator is running
      simulator.running = false;

      response.forEach(sim => {
        if (sim.name === name) {
          // save properties
          simulator.running = true;
          //simulator.defaultTypes = sim.units;
          //simulator.defaultLabels = sim.series;
        }
      });

      AppDispatcher.dispatch({
        type: 'simulators/running',
        simulator: simulator,
        running: simulator.running
      });

      // remove timer if needed
      if (simulator.running) {
        const index = this._timers.findIndex(timer => {
          return timer.simulator === simulator._id;
        });

        if (index !== -1) {
          clearInterval(this._timers[index].id);

          console.log('stop interval ' + this._timers[index].id);

          this._timers.splice(index, 1);
        }
      }
    }).catch(error => {
      //console.log(error);

      simulator.running = false;

      AppDispatcher.dispatch({
        type: 'simulators/running',
        simulator: simulator,
        running: simulator.running
      });

      // check for existing timer
      const timer = this._timers.find(element => {
        return element.simulator === simulator._id;
      });

      if (timer == null) {
        // add timer
        var self = this;

        const timerID = setInterval(function() {
          self.isRunning(simulator);
        }, 5000);

        console.log('start interval ' + timerID);

        this._timers.push({ id: timerID, simulator: simulator._id });
      }
    });
  }
}

export default new SimulatorsDataManager();
