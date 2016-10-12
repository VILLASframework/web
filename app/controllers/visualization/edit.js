/**
 * File: edit.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 05.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';
import FetchLiveDataMixin from '../../mixins/fetch-live-data';

export default Ember.Controller.extend(FetchLiveDataMixin, {
  isShowingPlotValueModal: false,

  errorMessage: null,

  plot: null,
  name: null,
  simulator: null,
  simulatorName: null,
  signal: null,

  _updateSimulators: function() {
    if (this.get('model.simulators') !== null && this.get('model.simulators.length') > 0) {
      let simulators = this.get('model.simulators');
      this.set('simulatorName', simulators.toArray()[0].get('name'));
    }
  }.observes('model'),

  actions: {
    addPlot(name) {
      var plot = null;

      if (name === 'chart') {
        // create new chart plot
        plot = this.store.createRecord('plot', { name: 'Chart 1', type: 'plot-chart' });
      } else if (name === 'table') {
        plot = this.store.createRecord('plot', { name: 'Table 1', type: 'plot-table', width: 500, height: 200, title: 'Table 1' });
      } else if (name === 'value') {
        plot = this.store.createRecord('plot', { name: 'Value 1', type: 'plot-value', simulator: 2 });
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
    },

    showPlotDialog(plot) {
      // show dialog by plot type
      let plotType = plot.get('type');
      if (plotType === 'plot-value') {
        // set properties
        this.set('plot', plot);
        /*this.set('name', plot.get('name'));
        this.set('signal', plot.get('signal'));*/

        //this.set('simulatorName', simulatorName);

        this.set('isShowingPlotValueModal', true);
      }
    },

    submitValuePlot() {
      // verify properties
      let properties = this.getProperties('name', 'simulator', 'signal');
      if (properties['name'] === null || properties['name'] === "") {
        this.set('errorMessage', 'Plot name is missing');
        return;
      }

      properties['simulator'] = Number(properties['simulator']);
      properties['signal'] = Number(properties['signal']);

      // save properties
      this.get('plot').setProperties(properties);

      let self = this;

      this.get('plot').save().then(function() {
        self.set('isShowingPlotValueModal', false);
      }, function() {
        Ember.debug('Error saving value plot');
      });
    },

    cancelValuePlot() {
      this.set('isShowingPlotValueModal', false);
    },

    selectSimulator(simulator) {
      this.set('simulatorName', simulator);
    }
  }
});
