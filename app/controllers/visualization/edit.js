import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    addPlot(name) {
      var plot = null;

      if (name === 'chart') {
        // create new chart plot
        plot = this.store.createRecord('plot', { name: 'Chart 1', signal: 'Signal 1', type: 'chart' });
      } else if (name === 'table') {
        plot = this.store.createRecord('plot', { name: 'Table 1', signal: 'Signal 1', type: 'table', width: 500, height: 200 });
      } else if (name === 'value') {
        plot = this.store.createRecord('plot', { name: 'Value 1', signal: 'Signal 1', type: 'value' });
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
    }
  }
});
