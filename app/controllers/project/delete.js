/**
 * File: delete.js
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
    cancelDelete() {
      // go back to project view
      let projectId = this.get('model.id');
      this.transitionToRoute('/project/' + projectId);
    },

    confirmDelete() {
      // delete the project
      var project = this.get('model');
      project.destroyRecord();

      this.transitionToRoute('/projects');
    }
  }
});
