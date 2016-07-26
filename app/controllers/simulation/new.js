/**
 * File: new.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  sessionUser: Ember.inject.service('session-user'),

  actions: {
    newSimulation() {
      // get current user
      var user = this.get('sessionUser.user');

      // create new simulation from properties
      var properties = this.getProperties('name');
      properties['owner'] = user;

      var simulation = this.store.createRecord('simulation', properties);
      var controller = this;

      simulation.save().then(function() {
        controller.transitionToRoute('/simulations');
      }, function() {
        Ember.debug('Error saving new simulation');
      });
    },

    cancelNewSimulation() {
      this.transitionToRoute('/simulations');
    }
  }
});
