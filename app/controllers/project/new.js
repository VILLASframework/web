/**
 * File: new.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  sessionUser: Ember.inject.service('session-user'),

  actions: {
    newProject() {
      // get current user
      var user = this.get('sessionUser.user');

      // create new project from properties
      var properties = this.getProperties('name');
      properties['owner'] = user;

      var project = this.store.createRecord('project', properties);
      var controller = this;

      project.save().then(function() {
        controller.transitionToRoute('/projects');
      });
    },

    cancelNewProject() {
      this.transitionToRoute('/projects');
    }
  }
});
