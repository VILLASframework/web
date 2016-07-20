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
  sessionUser: Ember.inject.service('session-user'),

  actions: {
    newModel() {
      // get current user
      var user = this.get('sessionUser.user');

      // create new model from properties
      var properties = this.getProperties('name');
      properties['owner'] = user;

      var simulationModel = this.store.createRecord('simulation-model', properties);
      var controller = this;

      simulationModel.save().then(function() {
        Ember.debug('Saved new model');
        controller.transitionToRoute('/simulation-models');
      }, function() {
        Ember.debug('Error saving new model');
      });
    },

    cancelNewModel() {
      this.transitionToRoute('/simulation-models');
    }
  }
});
