/**
 * File: index.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  values: function() {
    return this.get('simulationData.values');
  }.property('simulationData.values.@each'),

  _getData: function() {
    if (this.get('model.simulation.running') == true) {
      var simulator = this.get('model.simulator');
      if (simulator == null) {
        return;
      }

      var data = this.store.peekRecord('simulation-data', simulator);
      this.set('simulationData', data);

      // load model again if simulation data is null
      // this prevents from simulation data not being loaded when the controller
      // is loaded before the websocket connects
      if (data === null) {
        Ember.run.later(this, function() {
          // trigger _getData
          this.notifyPropertyChange('model');
        }, 1000);
      }
    } else {
      // clear simulation data
      this.set('simulationData', null);

      // check again if simulation is running now
      Ember.run.later(this, function() {
        // trigger _getData
        this.notifyPropertyChange('model');
      }, 1000);
    }
  }.observes('model').on('init')
});
