/**
 * File: delete.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    cancelDelete() {
      // go back to visualization edit view
      let visualizationId = this.get('model.id');
      this.transitionToRoute('/visualization/' + visualizationId);
    },

    confirmDelete() {
      // get the objects
      var projectId = this.get('model.project.id');

      var visualization = this.get('model');
      visualization.destroyRecord();

      this.transitionToRoute('/project/' + projectId);
    }
  }
});
