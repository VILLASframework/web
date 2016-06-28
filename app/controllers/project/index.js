import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    newVisualization() {
      // get the project
      var project = this.get('model');
      var projectId = this.get('model.id');

      // create the visualization
      var visualization = this.store.createRecord('visualization', { name: 'Visualization', project: projectId });

      // the visualization must be added to the project before the project is saved, otherwise ember will set the projectId to null!
      project.get('visualizations').pushObject(visualization);

      // save the visualization and project
      visualization.save().then(function() {
        project.save();
      });
    }
  }
});
