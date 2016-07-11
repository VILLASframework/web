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
