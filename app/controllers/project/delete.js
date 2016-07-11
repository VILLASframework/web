import Ember from 'ember';

export default Ember.Controller.extend({
  sessionUser: Ember.inject.service('session-user'),

  actions: {
    cancelDelete() {
      // go back to project view
      let projectId = this.get('model.id');
      this.transitionToRoute('/project/' + projectId);
    },

    confirmDelete() {
      // delete the project
      var project = this.get('model');
      project.destroyRecord();

      this.transitionToRoute('/projects');
    }
  }
});
