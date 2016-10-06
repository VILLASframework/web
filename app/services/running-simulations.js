/**
 * File: running-simulations.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

const {
  inject: { service }
} = Ember;

export default Ember.Service.extend({
  session: service('session'),
  sessionUser: Ember.inject.service('session-user'),
  store: service(),

  simulationModels: [],

  loadRunningSimulations: function() {
    var self = this;

    // check for running simulations
    setInterval(function() {
      if (self.get('sessionUser.user') != null) {
        // check if running simulations did changed
        self.get('store').findAll('simulation').then(function(simulations) {
          // search for running simulations
          simulations.forEach(function(simulation) {
            if (simulation.get('running') === true) {
              // get all models of the simulation
              simulation.get('models').forEach(function(model) {
                self.get('store').findRecord('simulation-model', model.get('id')).then(function(m) {
                  // add to array
                  self._addSimulationModel(m);
                });
              });
            } else {
              // clear all models of the simulation
            }
          });
        });
      }
    }, 3000);
  },

  _addSimulationModel(simulationModel) {
    // check if the model is already in the array
    var models = this.get('simulationModels');
    var length = models.get('length');

    for (var i = 0; i < length; i++) {
      if (models[i].get('id') === simulationModel.get('id')) {
        return;
      }
    }

    // not found, so add to the array
    this.get('simulationModels').pushObject(simulationModel);
  }
});
