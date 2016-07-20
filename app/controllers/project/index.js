/**
 * File: index.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    newVisualization() {
      // get the project
      var project = this.get('model');
      var projectId = this.get('model.id');

      // create the visualization
      var visualization = this.store.createRecord('visualization', { name: 'Visualization', project: projectId });

      // this change will not be saved, but it is nessecary otherwise ember will omit the project's id in the post request
      project.get('visualizations').pushObject(visualization);

      visualization.save();
    }
  }
});
