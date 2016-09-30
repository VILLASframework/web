/**
 * File: new.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  simulator: null,

  actions: {
    newModel() {
      // get the simulation
      var simulation = this.get('model.simulation');
      var simulationId = this.get('model.simulation.id');

      // create new model from properties
      var properties = this.getProperties('name');
      properties['simulation'] = simulationId;

      // get the simulator id by simulator name
      if (this.get('simulator') == null) {
        this.set('simulator', this.get('model.simulators')[0]);
      }

      console.log(this.get('model.simulators')[0]);

      /*var simulationModel = this.store.createRecord('simulation-model', properties);

      // this change will not be saved, but it is nessecary otherwise ember will omit the simulation's id in the post request
      simulation.get('models').pushObject(simulationModel);

      var controller = this;

      simulationModel.save().then(function() {
        controller.transitionToRoute('/simulation/' + simulationId);
      }, function() {
        Ember.debug('Error saving new model');
      });*/
    },

    cancelNewModel() {
      var simulationId = this.get('model.simulation.id');
      this.transitionToRoute('/simulation/' + simulationId);
    },

    selectSimulator(simulator) {
      this.set('simulator', simulator);
    }
  }
});
