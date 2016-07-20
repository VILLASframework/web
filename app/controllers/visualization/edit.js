/**
 * File: edit.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 05.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    addPlot(name) {
      var plot = null;

      if (name === 'chart') {
        // create new chart plot
        plot = this.store.createRecord('plot', { name: 'Chart 1', signal: 'Signal 1', type: 'plot-chart' });
      } else if (name === 'table') {
        plot = this.store.createRecord('plot', { name: 'Table 1', signal: 'Signal 1', type: 'plot-table', width: 500, height: 200, title: 'Table 1' });
      } else if (name === 'value') {
        plot = this.store.createRecord('plot', { name: 'Value 1', signal: 'Signal 1', type: 'plot-value' });
      } else {
        // DEBUG
        console.log('Add plot: ' + name);
        return;
      }

      if (plot != null) {
        // add plot to visualization
        this.get('model.plots').pushObject(plot);

        // save new plot
        var visualization = this.get('model');

        plot.save().then(function() {
          // save the plot in the visualization
          visualization.get('plots').pushObject(plot);
          visualization.save();
        });
      } else {
        console.error('Unknown plot type: ' + name);
      }
    },

    saveEdit() {
      // save changes to store
      var plots = this.get('model.plots');
      plots.forEach(function(plot) {
        plot.save();
      });

      // go back to index
      var id = this.get('model.id');
      this.transitionToRoute('/visualization/' + id);
    },

    cancelEdit() {
      // TODO: revert changes

      let id = this.get('model.id');
      this.transitionToRoute('/visualization/' + id);
    }
  }
});
