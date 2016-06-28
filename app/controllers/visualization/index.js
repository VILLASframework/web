import Ember from 'ember';

export default Ember.Controller.extend({
  plots: [],

  actions: {
    addPlot(name) {
      var plot = null;

      if (name === 'chart') {
        // create new chart plot
        plot = this.store.createRecord('plot', { name: 'Chart 1', signal: 'Signal 1' });
      } else if (name === 'table') {
        plot = this.store.createRecord('plot-table', { name: 'Table 1', signal: 'Signal 1', width: 500 });
      } else if (name === 'value') {
        plot = this.store.createRecord('plot', { name: 'Value 1', signal: 'Signal 1' });
      } else {
        // DEBUG
        console.log('Add plot: ' + name);
        return;
      }

      if (plot != null) {
        // add plot to visualization
        this.plots.pushObject(plot);
      } else {
        console.error('Unknown plot type: ' + name);
      }
    }
  }
});
