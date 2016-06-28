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
      var visualization = this.get('model');
      let visualizationId = this.get('model.id');

      var projectId = this.get('model.project.id');
      var project = this.store.peekRecord('project', projectId);

      // delete the visualization and remove from the project
      project.get('visualizations').removeObject(visualizationId);
      project.save().then(function() {
        // destroy all plots
        var plots = visualization.get('plots');
        plots.forEach(function(plot) {
          plot.destroyRecord();
        });

        visualization.destroyRecord();

        this.transitionToRoute('/project/' + projectId);
      });
    }
  }
});
