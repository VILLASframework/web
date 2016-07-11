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
