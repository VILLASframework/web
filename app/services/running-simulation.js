/**
 * File: running-simulation.js
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
  store: service(),

  loadRunningSimulation: function() {
    var self = this;

    // check every second for running simulation
    setInterval(function() {
      // check if running simulation did changed
      self.get('store').findAll('simulation').then(function(simulations) {
        var newSimulation = null;

        simulations.forEach(function(simulation) {
          if (simulation.get('running') === true) {
            newSimulation = simulation;
          }
        });

        if (newSimulation !== self.get('simulation')) {
          self.set('simulation', newSimulation);
        }
      });
    }, 1000);
  }
});
