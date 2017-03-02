/**
 * File: simulators-data-manager.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import RestAPI from '../api/rest-api';
import AppDispatcher from '../app-dispatcher';

const SimulatorsDataManager = {
  loadSimulators() {
    RestAPI.get('/simulators').then(response => {
      AppDispatcher.dispatch({
        type: 'simulators/loaded',
        simulators: response.simulators
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'simulators/load-error',
        error: error
      });
    });
  },

  addSimulator(simulator) {
    RestAPI.post('/simulators', { simulator: simulator }).then(response => {
      AppDispatcher.dispatch({
        type: 'simulators/added',
        simulator: response.simulator
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'simulators/add-error',
        error: error
      });
    });
  },

  removeSimulator(simulator) {
    RestAPI.delete('/simulators/' + simulator._id).then(response => {
      AppDispatcher.dispatch({
        type: 'simulators/removed',
        simulator: simulator
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'simulators/remove-error',
        error: error
      });
    });
  },

  editSimulator(simulator) {
    RestAPI.put('/simulators/' + simulator._id, { simulator: simulator }).then(response => {
      AppDispatcher.dispatch({
        type: 'simulators/edited',
        simulator: response.simulator
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'simulators/edit-error',
        error: error
      });
    });
  }
}

export default SimulatorsDataManager;
